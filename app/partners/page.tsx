import type { Metadata } from 'next'
import { PartnersContent } from '@/components/partners-content'

export const metadata: Metadata = {
  title: 'Partners | Glacier Fresh',
  description:
    'Explore Glacier Fresh partner opportunities for wholesalers, dealers, and installers.',
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen">
      <PartnersContent />
    </main>
  )
}
