import { Hero } from '@/components/hero'
import { CmsProductLine } from '@/components/cms-product-line'
import { WhyChoose } from '@/components/why-choose'
import { PartnerCTA } from '@/components/partner-cta'
import { TrustedBy } from '@/components/trusted-by'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CmsProductLine />
      <WhyChoose />
      <PartnerCTA />
      <TrustedBy />
    </main>
  )
}
