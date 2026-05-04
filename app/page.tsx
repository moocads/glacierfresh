import { Hero } from '@/components/hero'
import { ProductLine } from '@/components/product-line'
import { WhyChoose } from '@/components/why-choose'
import { PartnerCTA } from '@/components/partner-cta'
import { TrustedBy } from '@/components/trusted-by'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductLine />
      <WhyChoose />
      <PartnerCTA />
      <TrustedBy />
    </main>
  )
}
