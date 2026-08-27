import { NextResponse } from 'next/server'

type StrapiCollectionResponse = {
  data?: unknown[]
  meta?: {
    pagination?: {
      page?: number
      pageCount?: number
      pageSize?: number
      total?: number
    }
  }
}

function getCartridgeProductsUrl(configuredUrl: string, page: number) {
  const trimmed = configuredUrl.replace(/\/$/, '')
  const url = new URL(
    trimmed.includes('/api/')
      ? trimmed.replace(/\/api\/[^?]+/, '/api/cartridge-products')
      : `${trimmed}/api/cartridge-products`,
  )

  for (const key of [...url.searchParams.keys()]) {
    if (key === 'populate' || key.startsWith('populate[')) {
      url.searchParams.delete(key)
    }
  }

  url.searchParams.set('populate[category]', 'true')
  url.searchParams.set('populate[commonSpecifications]', 'true')
  url.searchParams.set('populate[sizeVariants][populate][size]', 'true')
  url.searchParams.set('populate[sizeVariants][populate][featureImage]', 'true')
  url.searchParams.set('populate[sizeVariants][populate][galleryImages]', 'true')
  url.searchParams.set(
    'populate[sizeVariants][populate][micronConfigurations][populate][micronRating]',
    'true',
  )
  url.searchParams.set(
    'populate[sizeVariants][populate][micronConfigurations][populate][filtrationCapabilities]',
    'true',
  )
  url.searchParams.set('pagination[page]', String(page))
  url.searchParams.set('pagination[pageSize]', '100')
  url.searchParams.set('sort[0]', 'sortOrder:asc')
  url.searchParams.set('sort[1]', 'id:asc')

  return url.toString()
}

export async function GET() {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL
  const token = process.env.CMS_API_TOKEN ?? process.env.STRAPI_API_TOKEN

  if (!configuredUrl) {
    return NextResponse.json(
      { error: 'CMS_API_URL is not configured.' },
      { status: 500 },
    )
  }

  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  try {
    const firstRes = await fetch(getCartridgeProductsUrl(configuredUrl, 1), {
      headers,
      next: { revalidate: 60 },
    })

    if (!firstRes.ok) {
      return NextResponse.json(
        {
          error: 'Failed to fetch cartridge products from CMS',
          upstreamStatus: firstRes.status,
        },
        { status: 500 },
      )
    }

    const firstPage = (await firstRes.json()) as StrapiCollectionResponse
    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1
    const allData = Array.isArray(firstPage.data) ? [...firstPage.data] : []

    for (let page = 2; page <= pageCount; page += 1) {
      const res = await fetch(getCartridgeProductsUrl(configuredUrl, page), {
        headers,
        next: { revalidate: 60 },
      })

      if (!res.ok) {
        return NextResponse.json(
          {
            error: 'Failed to fetch cartridge products from CMS',
            upstreamStatus: res.status,
          },
          { status: 500 },
        )
      }

      const pageData = (await res.json()) as StrapiCollectionResponse
      if (Array.isArray(pageData.data)) allData.push(...pageData.data)
    }

    return NextResponse.json({
      ...firstPage,
      data: allData,
      meta: {
        ...firstPage.meta,
        pagination: {
          ...firstPage.meta?.pagination,
          page: 1,
          pageSize: allData.length,
          pageCount: 1,
          total: allData.length,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching cartridge products from CMS:', error)
    return NextResponse.json(
      { error: 'Unexpected error fetching cartridge products' },
      { status: 500 },
    )
  }
}
