'use client'

import Image from 'next/image'
import Link from 'next/link'
import { productCategories } from '@/lib/products-catalog-data'
import { cn } from '@/lib/utils'

type ProductsMegaMenuContentProps = {
  onNavigate?: () => void
  className?: string
}

export function ProductsMegaMenuContent({
  onNavigate,
  className,
}: ProductsMegaMenuContentProps) {
  return (
    <div
      className={cn(
        'container mx-auto px-4 py-10 lg:px-8',
        className,
      )}
    >
      <div className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
        {productCategories.map((cat, colIndex) => {
          const preview = cat.products[0]
          const isSvg = preview.imageSrc.endsWith('.svg')

          return (
            <div
              key={cat.id}
              className={cn(
                'min-w-0 md:px-5 lg:px-8',
                colIndex === 0 && 'md:pl-0',
                colIndex === productCategories.length - 1 && 'md:pr-0',
              )}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-start sm:gap-8">
                <Link
                  href={`/products#${cat.id}`}
                  onClick={onNavigate}
                  className="group block min-w-0"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border transition group-hover:ring-primary/50">
                    <Image
                      src={preview.imageSrc}
                      alt={preview.imageAlt}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(min-width: 768px) 28vw, 50vw"
                      unoptimized={isSvg}
                    />
                  </div>
                  <h3 className="font-heading mt-3 text-lg font-bold tracking-tight text-secondary transition group-hover:text-primary md:text-xl">
                    {cat.title}
                  </h3>
                </Link>

                <ul className="flex flex-col gap-2.5 sm:pt-1" role="list">
                  {cat.products.map((p) => (
                    <li key={p.title}>
                      <Link
                        href={`/products#${cat.id}`}
                        onClick={onNavigate}
                        className="block text-sm leading-snug text-muted-foreground transition hover:text-primary"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
