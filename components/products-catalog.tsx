'use client'

import { useEffect, useState } from 'react'
import { ProductListCard } from '@/components/product-list-card'
import { cn } from '@/lib/utils'
import { useProductCatalog } from '@/lib/use-product-catalog'

export function ProductsCatalog() {
  const { categories } = useProductCatalog()
  const [activeCategoryId, setActiveCategoryId] = useState('')

  useEffect(() => {
    if (!categories.length) return
    if (!activeCategoryId || !categories.some((cat) => cat.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id)
    }
  }, [activeCategoryId, categories])

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ?? categories[0]

  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-muted/35 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Products
          </p>
          <h1 className="mt-3 font-heading text-4xl font-heavy text-secondary md:text-5xl">
            All Products
          </h1>
        </div>
      </section>

      <section className="sticky top-20 z-40 border-b border-border bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-3 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Product categories"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory?.id === category.id}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors md:px-6 md:py-2.5 md:text-base',
                  activeCategory?.id === category.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-transparent bg-muted/60 text-secondary hover:border-primary/30 hover:bg-muted hover:text-primary',
                )}
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.navLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        {activeCategory ? (
          <>
            <div className="mb-8 border-b border-border pb-4">
              <h2 className="font-heading text-3xl font-heavy text-primary md:text-4xl">
                {activeCategory.title}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeCategory.products.map((product) => (
                <ProductListCard
                  key={product.slug}
                  categorySlug={activeCategory.id}
                  product={product}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-secondary">No products available.</p>
        )}
      </section>
    </main>
  )
}
