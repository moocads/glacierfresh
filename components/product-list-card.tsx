'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProductWithDetails } from '@/lib/use-product-catalog'
import { cn } from '@/lib/utils'

type ProductListCardProps = {
  categorySlug: string
  product: ProductWithDetails
}

export function ProductListCard({
  categorySlug,
  product,
}: ProductListCardProps) {
  const imageSrc = product.imageSrc || '/images/products.png'
  const href = `/products/${categorySlug}/${product.slug}`
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
  }, [imageSrc])

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-background transition hover:border-primary/40 hover:shadow-md">
      <Link href={href} className="relative aspect-[4/3] overflow-hidden bg-white">
        {!isLoaded && (
          <Skeleton className="absolute inset-0 rounded-none bg-gray-200/80" />
        )}
        <Image
          src={imageSrc}
          alt={product.imageAlt}
          fill
          className={cn(
            'object-contain p-5 transition duration-300 group-hover:scale-[1.03]',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw"
          unoptimized={imageSrc.endsWith('.svg')}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {!isLoaded ? (
          <>
            <Skeleton className="h-6 w-3/4 rounded-md bg-gray-200/80" />
            {product.model && (
              <Skeleton className="mt-2 h-4 w-1/2 rounded-md bg-gray-200/80" />
            )}
            <Skeleton className="mt-2 h-10 w-28 rounded-full bg-gray-200/80" />
          </>
        ) : (
          <>
            <h2 className="font-heading text-xl font-bold text-secondary">
              {product.name ?? product.title}
            </h2>
            {product.model && (
              <p className="mt-2 text-sm font-semibold text-primary">
                Model: {product.model}
              </p>
            )}
            <Button
              asChild
              className="mt-auto w-fit mt-2 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-600"
            >
              <Link href={href}>Learn More</Link>
            </Button>
          </>
        )}
      </div>
    </article>
  )
}
