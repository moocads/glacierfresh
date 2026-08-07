import Link from 'next/link'
import { WholeHouseCatalog } from '@/components/whole-house/whole-house-catalog'

const featureChips = [
  'NSF/ANSI 42 materials',
  '10" – 20"',
  'Standard & Heavy-Duty',
  'Single to 3-stage',
]

export function WholeHousePage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-primary-50 bg-gradient-to-b from-primary-50/70 to-white">
        <div className="container mx-auto px-4 pb-9 pt-9 lg:px-8">
          <nav
            className="mb-4 text-[13px] text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/products" className="transition-colors hover:text-primary">
              Products
            </Link>
            <span aria-hidden="true"> / </span>
            <span>Whole House Solution</span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Whole House · Point of entry
          </p>
          <h1 className="mt-1 font-heading text-[32px] font-semibold leading-tight tracking-[-0.01em] text-secondary md:text-[38px]">
            Whole house water filtration
          </h1>
          <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-secondary-300">
            Choose a housing for your flow and duty, then match a cartridge by
            filtration media, particle targets, size, and service life.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {featureChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-primary-100 bg-white px-3 py-1.5 text-xs font-medium text-primary-700 shadow-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <WholeHouseCatalog />
    </main>
  )
}
