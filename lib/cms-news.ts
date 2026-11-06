export type NewsTextNode = {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

export type NewsLinkNode = {
  type: 'link'
  url?: string
  children?: NewsInlineNode[]
}

export type NewsInlineNode = NewsTextNode | NewsLinkNode

export type NewsBlock = {
  type?: string
  level?: number
  format?: 'ordered' | 'unordered'
  children?: Array<NewsInlineNode | NewsBlock>
}

export type TradeShow = {
  id: number | string
  title: string
  startDate: string
  endDate: string
  location: string
  boothNumber: string
  externalUrl?: string
  sortOrder?: number
}

export type NewsStory = {
  id: number | string
  title: string
  slug?: string
  summary?: string
  content: NewsBlock[]
  eventDate?: string
  coverImageUrl?: string
  coverImageAlt: string
  videoUrl?: string
  sortOrder?: number
}

type StrapiMedia = {
  url?: string | null
  alternativeText?: string | null
  formats?: {
    small?: { url?: string | null }
    medium?: { url?: string | null }
    large?: { url?: string | null }
  } | null
}

type StrapiTradeShow = {
  id: number
  documentId?: string | null
  title?: string | null
  startDate?: string | null
  endDate?: string | null
  location?: string | null
  boothNumber?: string | null
  externalUrl?: string | null
  sortOrder?: number | null
}

type StrapiNewsStory = {
  id: number
  documentId?: string | null
  title?: string | null
  slug?: string | null
  summary?: string | null
  content?: NewsBlock[] | null
  eventDate?: string | null
  coverImage?: StrapiMedia | null
  videoUrl?: string | null
  sortOrder?: number | null
}

type StrapiCollectionResponse<T> = {
  data?: T[]
}

const PAGE_SIZE = '100'

function getCollectionUrl(
  configuredUrl: string,
  collection: 'trade-shows' | 'news-stories',
) {
  const trimmed = configuredUrl.replace(/\/$/, '')
  const url = new URL(
    trimmed.includes('/api/')
      ? trimmed.replace(/\/api\/[^?]+/, `/api/${collection}`)
      : `${trimmed}/api/${collection}`,
  )

  url.search = ''
  url.searchParams.set('status', 'published')
  url.searchParams.set('filters[isVisible][$eq]', 'true')
  url.searchParams.set('pagination[pageSize]', PAGE_SIZE)
  url.searchParams.set('sort[0]', 'sortOrder:asc')

  if (collection === 'trade-shows') {
    url.searchParams.set('sort[1]', 'startDate:asc')
  } else {
    url.searchParams.set('sort[1]', 'eventDate:desc')
    url.searchParams.set('populate[coverImage]', 'true')
  }

  return url.toString()
}

function toAbsoluteMediaUrl(url: string, configuredUrl: string) {
  if (/^https?:\/\//i.test(url)) return url
  return new URL(url, new URL(configuredUrl).origin).toString()
}

function getCoverImageUrl(media: StrapiMedia | null | undefined) {
  return (
    media?.formats?.large?.url ??
    media?.formats?.medium?.url ??
    media?.formats?.small?.url ??
    media?.url
  )
}

function getServerHeaders() {
  const token = process.env.CMS_API_TOKEN ?? process.env.STRAPI_API_TOKEN
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

function compareSortOrder(a?: number, b?: number) {
  return (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER)
}

function isHttpUrl(value: string) {
  try {
    const protocol = new URL(value).protocol
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

async function getTradeShows(configuredUrl: string): Promise<TradeShow[]> {
  try {
    const response = await fetch(getCollectionUrl(configuredUrl, 'trade-shows'), {
      headers: getServerHeaders(),
      next: { revalidate: 60 },
    })

    if (!response.ok) return []

    const payload = (await response.json()) as StrapiCollectionResponse<StrapiTradeShow>
    if (!Array.isArray(payload.data)) return []

    return payload.data
      .flatMap<TradeShow>((item) => {
        const title = item.title?.trim()
        const startDate = item.startDate?.trim()
        const endDate = item.endDate?.trim()
        const location = item.location?.trim()
        const boothNumber = item.boothNumber?.trim()

        if (!title || !startDate || !endDate || !location || !boothNumber) return []

        const externalUrl = item.externalUrl?.trim()
        return [{
          id: item.documentId ?? item.id,
          title,
          startDate,
          endDate,
          location,
          boothNumber,
          externalUrl: externalUrl && isHttpUrl(externalUrl) ? externalUrl : undefined,
          sortOrder: item.sortOrder ?? undefined,
        }]
      })
      .sort((a, b) => {
        const bySortOrder = compareSortOrder(a.sortOrder, b.sortOrder)
        return bySortOrder || a.startDate.localeCompare(b.startDate)
      })
  } catch {
    return []
  }
}

async function getNewsStories(configuredUrl: string): Promise<NewsStory[]> {
  try {
    const response = await fetch(getCollectionUrl(configuredUrl, 'news-stories'), {
      headers: getServerHeaders(),
      next: { revalidate: 60 },
    })

    if (!response.ok) return []

    const payload = (await response.json()) as StrapiCollectionResponse<StrapiNewsStory>
    if (!Array.isArray(payload.data)) return []

    return payload.data
      .flatMap<NewsStory>((item) => {
        const title = item.title?.trim()
        if (!title || !Array.isArray(item.content)) return []

        const coverImageUrl = getCoverImageUrl(item.coverImage)?.trim()
        return [{
          id: item.documentId ?? item.id,
          title,
          slug: item.slug?.trim() || undefined,
          summary: item.summary?.trim() || undefined,
          content: item.content,
          eventDate: item.eventDate?.trim() || undefined,
          coverImageUrl: coverImageUrl
            ? toAbsoluteMediaUrl(coverImageUrl, configuredUrl)
            : undefined,
          coverImageAlt: item.coverImage?.alternativeText?.trim() || title,
          videoUrl: item.videoUrl?.trim() || undefined,
          sortOrder: item.sortOrder ?? undefined,
        }]
      })
      .sort((a, b) => {
        const bySortOrder = compareSortOrder(a.sortOrder, b.sortOrder)
        if (bySortOrder) return bySortOrder

        if (!a.eventDate && !b.eventDate) return 0
        if (!a.eventDate) return 1
        if (!b.eventDate) return -1
        return b.eventDate.localeCompare(a.eventDate)
      })
  } catch {
    return []
  }
}

export async function getNewsPageData() {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL

  if (!configuredUrl) return { tradeShows: [], stories: [] }

  const [tradeShows, stories] = await Promise.all([
    getTradeShows(configuredUrl),
    getNewsStories(configuredUrl),
  ])

  return { tradeShows, stories }
}
