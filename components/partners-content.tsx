import Image from 'next/image'
import { Button } from '@/components/ui/button'

const partnerSections = [
  {
    title: 'For Wholesalers & Distributors',
    description:
      'Scale your business with reliable supply and high-demand filtration products.',
    supportTitle: 'What we offer:',
    points: [
      'Consistent inventory across core SKUs',
      'Strong repeat purchase cycle (replacement filters)',
      'Designed for fast-moving distribution channels',
    ],
    cta: 'Explore Wholesale Opportunities',
    imageSrc: '/images/wholesaler-distributors.jpg',
    imageAlt: 'Wholesale and distribution partner support',
  },
  {
    title: 'For Dealers & Retail Partners',
    description:
      'Sell with confidence using products customers trust and support materials that convert.',
    supportTitle: 'How can we assist:',
    points: [
      'Best-selling, easy-to-position products',
      'Ready-to-use marketing assets',
      'Clear product differentiation',
    ],
    cta: 'Access Dealer Resources',
    imageSrc: '/images/retailer.jpg',
    imageAlt: 'Dealer and retail partner support',
  },
  {
    title: 'For Plumbers & Installers',
    description:
      'Install faster, reduce callbacks, and get the job done right the first time.',
    supportTitle: 'Our team supports:',
    points: [
      'Quick-install system design',
      'Step-by-step training videos',
      'Compatibility and troubleshooting support',
    ],
    cta: 'View Installation Hub',
    imageSrc: '/images/plumber.jpg',
    imageAlt: 'Plumber and installer support',
  },
]

export function PartnersContent() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative h-[300px] w-full md:h-[380px]">
          <Image
            src="/images/partner-program-banner-glaciers-fresh.jpg"
            alt="Glacier Fresh partner program"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-secondary/55" />
          <div className="container relative z-10 mx-auto flex h-full items-center px-4 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Partner Program
              </p>
              <h1 className="mt-3 font-heading text-4xl font-heavy leading-tight md:text-5xl lg:text-6xl">
                Grow with Glacier Fresh
              </h1>
              <p className="mt-4 text-base text-white/90 md:text-lg">
                Build lasting customer relationships with dependable water filtration solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-14 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading text-3xl font-heavy text-secondary md:text-4xl">
              Built for Every Type of Partner
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Our partner program is designed to support channel growth from wholesale to
              installation. With dependable inventory, practical sales enablement, and technical
              guidance, we help your team move faster and close with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18 lg:py-20">
        <div className="container mx-auto space-y-14 px-4 lg:space-y-20 lg:px-8">
          {partnerSections.map((section, index) => (
            <div
              key={section.title}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${index % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={section.imageSrc}
                  alt={section.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  unoptimized={section.imageSrc.endsWith('.svg')}
                />
              </div>

              <div>
                <h3 className="font-heading text-2xl font-heavy text-secondary md:text-3xl">
                  {section.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {section.description}
                </p>
                <p className="mt-6 text-base font-semibold text-secondary">{section.supportTitle}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Button className="mt-8 rounded-full px-7">{section.cta}</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
