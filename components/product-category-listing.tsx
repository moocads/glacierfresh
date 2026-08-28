'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductListCard } from '@/components/product-list-card'
import { useProductCatalog } from '@/lib/use-product-catalog'

type ProductCategoryListingProps = {
  categorySlug: string
}

export function ProductCategoryListing({ categorySlug }: ProductCategoryListingProps) {
  const { categories, loading } = useProductCatalog()
  const category = categories.find((cat) => cat.id === categorySlug)

  if (loading) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Products
          </p>
          <h1 className="mt-3 font-heading text-4xl font-heavy text-secondary">
            Loading products…
          </h1>
        </section>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Products
          </p>
          <h1 className="mt-3 font-heading text-4xl font-heavy text-secondary">
            Category not found
          </h1>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-muted/35 py-12 lg:py-16">
        <div className="container mx-auto flex flex-col gap-6 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Products
            </p>
            <h1 className="mt-3 font-heading text-4xl font-heavy text-secondary md:text-5xl">
              {category.title}
            </h1>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit rounded-full border-primary px-6 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductListCard
              key={product.slug}
              categorySlug={category.id}
              product={product}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
