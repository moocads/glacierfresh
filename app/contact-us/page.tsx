import type { Metadata } from 'next'
import { ContactContent } from '@/components/contact-content'

export const metadata: Metadata = {
  title: 'Contact Us | Glacier Fresh',
  description:
    'Contact Glacier Fresh for wholesale inquiries, product support, and partnership questions. We respond to all messages promptly.',
}

export default function ContactUsPage() {
  return (
    <main className="min-h-screen">
      <ContactContent />
    </main>
  )
}
