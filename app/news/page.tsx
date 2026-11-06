import type { Metadata } from 'next'
import { NewsContent } from '@/components/news-content'
import { getNewsPageData } from '@/lib/cms-news'

export const metadata: Metadata = {
  title: 'News & Events | Glacier Fresh',
  description:
    'Explore the latest stories from Glacier Fresh and find out where to meet our team next.',
}

export default async function NewsPage() {
  const { tradeShows, stories } = await getNewsPageData()

  return (
    <main className="min-h-screen">
      <NewsContent tradeShows={tradeShows} stories={stories} />
    </main>
  )
}
