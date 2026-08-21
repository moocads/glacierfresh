import { NextResponse } from 'next/server'

function getHomeCategorySectionsUrl(configuredUrl: string) {
  const trimmed = configuredUrl.replace(/\/$/, '')
  const url = new URL(
    trimmed.includes('/api/')
      ? trimmed.replace(/\/api\/[^?]+/, '/api/home-category-sections')
      : `${trimmed}/api/home-category-sections`,
  )

  url.searchParams.set('populate', '*')
  url.searchParams.set('filters[isVisible][$eq]', 'true')
  url.searchParams.set('sort[0]', 'sortOrder:asc')
  url.searchParams.set('sort[1]', 'id:asc')

  return url.toString()
}

export async function GET() {
  const configuredUrl =
    process.env.CMS_API_URL ?? process.env.NEXT_PUBLIC_CMS_API_URL

  if (!configuredUrl) {
    return NextResponse.json(
      {
        error:
          'CMS_API_URL is not configured. Add it in Vercel and/or .env.local for local dev.',
      },
      { status: 500 },
    )
  }

  try {
    const response = await fetch(getHomeCategorySectionsUrl(configuredUrl), {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to fetch home category sections from CMS',
          upstreamStatus: response.status,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error('Error fetching home category sections from CMS:', error)
    return NextResponse.json(
      { error: 'Unexpected error fetching home category sections' },
      { status: 500 },
    )
  }
}
