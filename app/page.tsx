import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { ProductLine } from '@/components/product-line'
import { WhyChoose } from '@/components/why-choose'
import { PartnerCTA } from '@/components/partner-cta'
import { TrustedBy } from '@/components/trusted-by'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ProductLine />
      <WhyChoose />
      <PartnerCTA />
      <TrustedBy />
      <Footer />
    </main>
  )
}
