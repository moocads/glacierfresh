'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useCmsCategories } from '@/lib/use-cms-categories'

type ProductsMegaMenuContentProps = {
  onNavigate?: () => void
  className?: string
}

export function ProductsMegaMenuContent({
  onNavigate,
  className,
}: ProductsMegaMenuContentProps) {
  const { categories } = useCmsCategories()

  return (
    <div
      className={cn(
        'container mx-auto px-2 py-6 lg:px-2',
        className,
      )}
    >
      <div className="grid gap-2 md:grid-cols-6 md:gap-0">
        {categories.map((cat, colIndex) => {
          const menuImage = cat.menuImage ?? ''
          const isSvg = menuImage.endsWith('.svg')

          return (
            <div
              key={cat.id}
              className={cn(
                'min-w-0 md:px-2',
                colIndex === 0 && 'md:pl-0',
                colIndex === categories.length - 1 && 'md:pr-0',
              )}
            >
              <div className="grid grid-cols-1 gap-2 sm:items-start ">
                <Link
                  href={`/products#${cat.id}`}
                  onClick={onNavigate}
                  className="group block min-w-0"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white ring-1 ring-border transition group-hover:ring-primary/50">
                    <Image
                      src={menuImage}
                      alt={cat.title}
                      fill
                      className="object-contain transition duration-300 group-hover:scale-[1.02]"
                      sizes="(min-width: 768px) 28vw, 50vw"
                      unoptimized={isSvg}
                    />
                  </div>
                  <h3 className="font-heading mt-3 text-lg font-bold tracking-tight text-secondary transition group-hover:text-primary md:text-xl">
                    {cat.title}
                  </h3>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
