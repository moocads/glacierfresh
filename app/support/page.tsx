import type { Metadata } from 'next'
import { SupportContent } from '@/components/support-content'

export const metadata: Metadata = {
  title: 'Support | Glacier Fresh',
  description:
    'Download Glacier Fresh product documentation, catalogues, and technical resources for partners and installers.',
}

export default function SupportPage() {
  return (
    <main className="min-h-screen">
      <SupportContent />
    </main>
  )
}
