import type { Metadata } from 'next'
import { AboutContent } from '@/components/about-content'

export const metadata: Metadata = {
  title: 'About | Glacier Fresh',
  description:
    'Glacier Fresh partners with distributors, retailers, and installers across North America. Learn about our manufacturing scale, certifications, and long-term partnership approach.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutContent />
    </main>
  )
}
