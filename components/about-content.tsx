import Image from 'next/image'
import Link from 'next/link'
import { Factory, Globe2, Package, Users } from 'lucide-react'
import { AboutVideoPlayer } from '@/components/about-video-player'
import { Button } from '@/components/ui/button'

const RETAIL_CHANNELS = [
  'Menards',
  'Do It Best',
  'The Home Depot Canada',
  "Lowe's Canada",
  'Walmart Canada',
] as const

const CAPABILITIES = [
  'NSF, CE, FDA, EPA, and ISO certified production',
  'Manufacturing facilities in China and Thailand',
  '30+ injection molding machines and 11 carbon rod production lines',
  'Daily production capacity exceeding 80,000 units',
] as const

const COMPANY_IMAGES = [
  {
    src: '/images/company/gf-company-01.jpg',
    alt: 'Glacier Fresh manufacturing and operations',
  },
  {
    src: '/images/company/gf-company-02.jpg',
    alt: 'Glacier Fresh production facility',
  },
  {
    src: '/images/company/gf-company-03.jpg',
    alt: 'Glacier Fresh engineering and quality',
  },
  {
    src: '/images/company/gf-company-04.jpg',
    alt: 'Glacier Fresh team and partnership support',
  },
] as const

const STATS = [
  { label: 'Years in manufacturing', value: '10+', icon: Factory },
  { label: 'Daily unit capacity', value: '80,000+', icon: Package },
  { label: 'Engineers & R&D', value: '50+', icon: Users },
  { label: 'Global footprint', value: '2 countries', icon: Globe2 },
] as const

export function AboutContent() {
  return (
    
    <div className="min-h-screen">
      {/* <section className="border-b border-border bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About us</p>
          <h1 className="mt-3 font-heading text-4xl font-heavy tracking-tight text-secondary md:text-5xl">
            Glacier Fresh
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Partnership-led water filtration manufacturing for North American retail, wholesale, and
            trade channels—with the scale and certifications partners expect.
          </p>
        </div>
      </section> */}
         <section className="relative overflow-hidden">
        <div className="relative h-[300px] w-full md:h-[380px]">
          <Image
            src="/images/about-banner.jpg"
            alt="Glacier Fresh partner program"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/55" />
          <div className="container relative z-10 mx-auto flex h-full items-center px-4 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                About Us
              </p>
              <h1 className="mt-3 font-heading text-4xl font-heavy leading-tight md:text-5xl lg:text-6xl">
                Glacier Fresh's Story
              </h1>
              <p className="mt-4 text-base text-white/90 md:text-lg">
                Partnership-led water filtration manufacturing for North American retail, wholesale, and
            trade channels—with the scale and certifications partners expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
            <div>
              <h2 className="font-heading text-3xl font-heavy text-secondary md:text-4xl">
                Built around long-term partnerships
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Glacier Fresh partners with distributors, wholesalers, retailers, and plumbers
                across North America to deliver reliable water filtration solutions built for
                long-term growth.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                From large-scale wholesale production to OEM &amp; ODM development, Glacier Fresh is
                committed to delivering dependable products and long-term partnership support.
              </p>
            </div>
            <AboutVideoPlayer />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
              <Image
                src={COMPANY_IMAGES[1].src}
                alt={COMPANY_IMAGES[1].alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-heavy text-secondary md:text-4xl">
                Retail &amp; distribution reach
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Our products support major retail and distribution channels, including:
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {RETAIL_CHANNELS.map((name) => (
                  <li
                    key={name}
                    className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-secondary shadow-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-heavy text-secondary md:text-4xl">
              Manufacturing capability that supports scale
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              With over 10 years of manufacturing experience, Glacier Fresh combines vertically
              integrated production, engineering expertise, and scalable supply capabilities to
              support partners worldwide.
            </p>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-4">
            {CAPABILITIES.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-left text-base leading-relaxed text-muted-foreground shadow-sm"
              >
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            Supported by a team of 50+ engineers and R&amp;D specialists, we develop filtration
            solutions focused on performance, reliability, and ease of installation.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col rounded-2xl border border-border bg-muted/40 p-6 text-center"
              >
                <Icon className="mx-auto size-8 text-primary" aria-hidden />
                <p className="mt-4 font-heading text-3xl font-heavy text-secondary">{value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="sr-only">Company gallery</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {COMPANY_IMAGES.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted shadow-sm"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center lg:px-8">
          <p className="font-heading text-xl font-semibold text-secondary md:text-2xl">
            Ready to grow with a manufacturing partner built for the long term?
          </p>
          <Button asChild className="mt-8 rounded-full px-8">
            <Link href="/partners">Explore the partner program</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
