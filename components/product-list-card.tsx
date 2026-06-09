'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { ProductWithDetails } from '@/lib/use-product-catalog'

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

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-background transition hover:border-primary/40 hover:shadow-md">
      <Link href={href} className="relative aspect-[4/3] bg-white">
        <Image
          src={imageSrc}
          alt={product.imageAlt}
          fill
          className="object-contain p-5 transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw"
          unoptimized={imageSrc.endsWith('.svg')}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
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
          className="mt-auto w-fit rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary-600"
        >
          <Link href={href}>Learn More</Link>
        </Button>
      </div>
    </article>
  )
}
