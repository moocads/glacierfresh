import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const DOC_ITEMS = [
  {
    title: 'Product catalogue',
    description: 'Core SKU overview and positioning for retail and wholesale.',
  }
] as const

const CATALOGUE_PDF = '/doc/Product-Catalogue.pdf'
const COVER_IMAGE = '/doc/catelog-cover.jpg'

export function SupportContent() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h1 className="font-heading text-4xl font-heavy tracking-tight text-secondary md:text-5xl">
            Support & documentation
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Find downloadable resources to support sales, installation, and after-sales service.
            Documents are updated periodically—bookmark this page or check back before your next
            project kickoff.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="sr-only">Documentation</h2>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {DOC_ITEMS.map((item) => (
              <li key={item.title} className="list-none">
                <article
                  className={cn(
                    'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
                    'shadow-sm transition-[box-shadow,border-color] duration-300',
                    'hover:border-primary/25 hover:shadow-md',
                  )}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <Image
                      src={COVER_IMAGE}
                      alt={`${item.title} cover`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-secondary">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-auto w-full rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link
                        href={CATALOGUE_PDF}
                        download
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <Download className="size-4 shrink-0" aria-hidden />
                        Download PDF
                      </Link>
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
