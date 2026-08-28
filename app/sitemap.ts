import type { MetadataRoute } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.glacierfreshbusiness.com'
).replace(/\/$/, '')

const STATIC_PATHS = [
  '/',
  '/about',
  '/products',
  '/partners',
  '/support',
  '/contact-us',
] as const

type CmsCategory = {
  slug?: string | null
  updatedAt?: string | null
}

type CmsProduct = {
  id: number
  name?: string | null
  model?: string | null
  slug?: string | null
  updatedAt?: string | null
  category?: CmsCategory | null
  whole_house_spec?: {
    kind?: 'housing' | 'cartridge' | null
  } | null
}

type CmsCartridgeProduct = {
  id: number
  name?: string | null
  slug?: string | null
  isActive?: boolean | null
  updatedAt?: string | null
  category?: CmsCategory | null
}

type CmsCollectionResponse<T> = {
  data?: T[]
  meta?: {
    pagination?: {
      pageCount?: number
    }
  }
}

function slugifyProduct(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getCollectionUrl(
  configuredUrl: string,
  collection: 'categories' | 'products' | 'cartridge-products',
  page: number,
) {
  const trimmed = configuredUrl.replace(/\/$/, '')
  const url = new URL(
    trimmed.includes('/api/')
      ? trimmed.replace(/\/api\/[^?]+/, `/api/${collection}`)
      : `${trimmed}/api/${collection}`,
  )

  url.search = ''
  url.searchParams.set('pagination[page]', String(page))
  url.searchParams.set('pagination[pageSize]', '100')

  if (collection === 'products') {
    url.searchParams.set('populate[category]', 'true')
    url.searchParams.set('populate[whole_house_spec]', 'true')
  }

  if (collection === 'cartridge-products') {
    url.searchParams.set('populate[category]', 'true')
  }

  return url.toString()
}

async function fetchCollection<T>(
  configuredUrl: string,
  collection: 'categories' | 'products' | 'cartridge-products',
) {
  const firstResponse = await fetch(
    getCollectionUrl(configuredUrl, collection, 1),
    { next: { revalidate: 60 } },
  )

  if (!firstResponse.ok) {
    throw new Error(`${collection} API returned ${firstResponse.status}`)
  }

  const firstPage = (await firstResponse.json()) as CmsCollectionResponse<T>
  const data = Array.isArray(firstPage.data) ? [...firstPage.data] : []
  const pageCount = firstPage.meta?.pagination?.pageCount ?? 1

  for (let page = 2; page <= pageCount; page += 1) {
    const response = await fetch(
      getCollectionUrl(configuredUrl, collection, page),
      { next: { revalidate: 60 } },
    )

    if (!response.ok) {
      throw new Error(`${collection} API page ${page} returned ${response.status}`)
    }

    const nextPage = (await response.json()) as CmsCollectionResponse<T>
    if (Array.isArray(nextPage.data)) data.push(...nextPage.data)
  }

  return data
}

function toDate(value?: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>()

  for (const path of STATIC_PATHS) {
    const url = `${SITE_URL}${path}`
    entries.set(url, {
      url,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1 : path === '/products' ? 0.9 : 0.7,
    })
  }

  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL

  if (!configuredUrl) return [...entries.values()]

  const [categoriesResult, productsResult, cartridgeProductsResult] =
    await Promise.allSettled([
      fetchCollection<CmsCategory>(configuredUrl, 'categories'),
      fetchCollection<CmsProduct>(configuredUrl, 'products'),
      fetchCollection<CmsCartridgeProduct>(
        configuredUrl,
        'cartridge-products',
      ),
    ])

  const categories =
    categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
  const products =
    productsResult.status === 'fulfilled' ? productsResult.value : []
  const cartridgeProducts =
    cartridgeProductsResult.status === 'fulfilled'
      ? cartridgeProductsResult.value
      : []

  for (const category of categories) {
    const slug = category.slug?.trim()
    if (!slug) continue

    const url = `${SITE_URL}/products/${slug}`
    entries.set(url, {
      url,
      lastModified: toDate(category.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  for (const product of products) {
    const categorySlug = product.category?.slug?.trim()
    if (
      categorySlug === 'whole-house-solution' &&
      product.whole_house_spec?.kind !== 'housing'
    ) {
      continue
    }

    const sourceSlug =
      product.slug?.trim() ||
      product.model?.trim() ||
      product.name?.trim() ||
      `product-${product.id}`
    const productSlug = slugifyProduct(sourceSlug)

    if (!categorySlug || !productSlug) continue

    const categoryUrl = `${SITE_URL}/products/${categorySlug}`
    if (!entries.has(categoryUrl)) {
      entries.set(categoryUrl, {
        url: categoryUrl,
        lastModified: toDate(product.category?.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    const url = `${categoryUrl}/${productSlug}`
    entries.set(url, {
      url,
      lastModified: toDate(product.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const product of cartridgeProducts) {
    if (product.isActive === false) continue

    const categorySlug = product.category?.slug?.trim()
    const productSlug = product.slug?.trim()
    if (!categorySlug || !productSlug) continue

    const url = `${SITE_URL}/products/${categorySlug}/${productSlug}`
    entries.set(url, {
      url,
      lastModified: toDate(product.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  return [...entries.values()]
}
