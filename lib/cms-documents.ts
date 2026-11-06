export type DownloadDocument = {
  id: number | string
  title: string
  shortDescription: string
  coverImageUrl: string
  coverImageAlt: string
  pdfUrl: string
  pdfFileName?: string
}

type StrapiMedia = {
  url?: string | null
  name?: string | null
  alternativeText?: string | null
  formats?: {
    small?: { url?: string | null }
    medium?: { url?: string | null }
    large?: { url?: string | null }
  } | null
}

type StrapiDocument = {
  id: number
  documentId?: string | null
  title?: string | null
  shortDescription?: string | null
  coverImage?: StrapiMedia | null
  pdfDocument?: StrapiMedia | null
}

type StrapiDocumentsResponse = {
  data?: StrapiDocument[]
}

const FALLBACK_DOCUMENTS: DownloadDocument[] = [
  {
    id: 'product-catalogue-fallback',
    title: 'Product catalogue',
    shortDescription: 'Core SKU overview and positioning for retail and wholesale.',
    coverImageUrl: '/doc/catelog-cover.jpg',
    coverImageAlt: 'Product catalogue cover',
    pdfUrl: '/doc/Product-Catalogue.pdf',
    pdfFileName: 'Product-Catalogue.pdf',
  },
]

function getDocumentsUrl(configuredUrl: string) {
  const trimmed = configuredUrl.replace(/\/$/, '')
  const url = new URL(
    trimmed.includes('/api/')
      ? trimmed.replace(/\/api\/[^?]+/, '/api/documents')
      : `${trimmed}/api/documents`,
  )

  url.search = ''
  url.searchParams.set('populate[coverImage]', 'true')
  url.searchParams.set('populate[pdfDocument]', 'true')
  url.searchParams.set('sort[0]', 'title:asc')

  return url.toString()
}

function toAbsoluteMediaUrl(url: string, configuredUrl: string) {
  if (/^https?:\/\//i.test(url)) return url

  const cmsOrigin = new URL(configuredUrl).origin
  return new URL(url, cmsOrigin).toString()
}

function getCoverImageUrl(media: StrapiMedia | null | undefined) {
  return (
    media?.formats?.medium?.url ??
    media?.formats?.small?.url ??
    media?.formats?.large?.url ??
    media?.url
  )
}

export async function getDownloadDocuments(): Promise<DownloadDocument[]> {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL

  if (!configuredUrl) return FALLBACK_DOCUMENTS

  const token = process.env.CMS_API_TOKEN ?? process.env.STRAPI_API_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined

  try {
    const response = await fetch(getDocumentsUrl(configuredUrl), {
      headers,
      next: { revalidate: 60 },
    })

    if (!response.ok) return FALLBACK_DOCUMENTS

    const payload = (await response.json()) as StrapiDocumentsResponse
    if (!Array.isArray(payload.data)) return FALLBACK_DOCUMENTS

    const documents = payload.data.flatMap<DownloadDocument>((item) => {
      const title = item.title?.trim()
      const shortDescription = item.shortDescription?.trim()
      const coverImageUrl = getCoverImageUrl(item.coverImage)?.trim()
      const pdfUrl = item.pdfDocument?.url?.trim()

      if (!title || !shortDescription || !coverImageUrl || !pdfUrl) return []

      return [
        {
          id: item.documentId ?? item.id,
          title,
          shortDescription,
          coverImageUrl: toAbsoluteMediaUrl(coverImageUrl, configuredUrl),
          coverImageAlt: item.coverImage?.alternativeText?.trim() || `${title} cover`,
          pdfUrl: toAbsoluteMediaUrl(pdfUrl, configuredUrl),
          pdfFileName: item.pdfDocument?.name?.trim() || undefined,
        },
      ]
    })

    return documents.length > 0 ? documents : FALLBACK_DOCUMENTS
  } catch {
    return FALLBACK_DOCUMENTS
  }
}
