'use client'

import Link from 'next/link'
import { ProductImageGallery } from '@/components/product-image-gallery'
import { Button } from '@/components/ui/button'
import { useProductCatalog } from '@/lib/use-product-catalog'

type ProductDetailContentProps = {
  categorySlug: string
  productSlug: string
}

export function ProductDetailContent({
  categorySlug,
  productSlug,
}: ProductDetailContentProps) {
  const { categories } = useProductCatalog()
  const category = categories.find((cat) => cat.id === categorySlug)
  const product = category?.products.find((item) => item.slug === productSlug)

  if (!category || !product) {
    return (
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Products
          </p>
          <h1 className="mt-3 font-heading text-4xl font-heavy text-secondary">
            Product not found
          </h1>
          <Button asChild className="mt-8 rounded-full bg-primary hover:bg-primary-600">
            <Link href="/products">Back to products</Link>
          </Button>
        </section>
      </main>
    )
  }

  const title = product.name ?? product.title
  const galleryImages = product.galleryImages.length
    ? product.galleryImages
    : [product.imageSrc]

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-8 lg:px-8 lg:py-14">
        <div className="mb-8">
          <Link
            href={`/products/${category.id}`}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {category.title}
          </Link>
        </div>

        <div className="mb-6 lg:hidden">
          <h1 className="font-heading text-3xl font-heavy text-secondary">
            {title}
          </h1>
          {product.model && (
            <p className="mt-2 font-heading text-lg font-semibold text-primary">
              Model: {product.model}
            </p>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
          <aside className="lg:sticky lg:top-28">
            <ProductImageGallery images={galleryImages} alt={product.imageAlt} />
          </aside>

          <article className="space-y-8">
            <div className="hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {category.title}
              </p>
              <h1 className="mt-3 font-heading text-5xl font-heavy text-secondary">
                {title}
              </h1>
              {product.model && (
                <p className="mt-3 font-heading text-xl font-semibold text-primary">
                  Model: {product.model}
                </p>
              )}
            </div>

            {product.description && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-secondary">
                  Product Information
                </h2>
                <p className="mt-4 text-base leading-relaxed text-secondary">
                  {product.description}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-secondary">
                  Specifications
                </h2>
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specs.map((spec) => (
                        <tr
                          key={`${spec.label}-${spec.value}`}
                          className="border-t border-border first:border-t-0"
                        >
                          <th className="w-2/5 bg-muted/50 px-4 py-3 text-left font-semibold text-secondary">
                            {spec.label}
                          </th>
                          <td className="px-4 py-3 text-secondary">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {product.accessories && product.accessories.length > 0 && (
              <section>
                <h2 className="font-heading text-2xl font-bold text-secondary">
                  Accessories
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary md:text-base">
                  {product.accessories.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}
