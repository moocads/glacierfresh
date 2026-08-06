'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  House,
  Ruler,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WholeHouseProductVisual } from '@/components/whole-house/whole-house-product-visual'
import {
  type WholeHouseCategory,
  type WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'
import { useWholeHouseCatalog } from '@/lib/use-whole-house-catalog'

type WholeHouseProductDetailProps = {
  productSlug: string
}

function getProductDescription(
  product: WholeHouseProduct,
  category: WholeHouseCategory,
) {
  if (category === 'housing') {
    const type = product.type ?? 'whole-house'
    const stageDescription = type.includes('Stage')
      ? `${type.replace('HD', 'heavy-duty').toLowerCase()} configuration`
      : `${type.toLowerCase()} housing`

    return `A ${stageDescription} designed for point-of-entry water filtration. Its ${product.length} × ${product.diameter} format and ${product.connection} connection make it easy to match with a compatible Glacier Fresh whole-house cartridge.`
  }

  return `A ${(product.media ?? 'whole-house').toLowerCase()} cartridge designed for ${(product.removes ?? 'water filtration').toLowerCase()}. The ${product.length} × ${product.diameter} format fits a matching Glacier Fresh housing and is rated at ${product.micron}.`
}

function getSpecifications(
  product: WholeHouseProduct,
  category: WholeHouseCategory,
) {
  if (category === 'housing') {
    return [
      ['Model', product.model],
      ['Product family', 'Whole House Solution'],
      ['System type', product.type],
      ['Length', product.length],
      ['Diameter', product.diameter],
      ['Connection', product.connection],
      ['Pressure gauge', product.gauge],
      ['Color', product.color],
    ]
  }

  return [
    ['Model', product.model],
    ['Product family', 'Whole House Solution'],
    ['Media', product.media],
    ['Designed to remove', product.removes],
    ['Micron rating', product.micron],
    ['Length', product.length],
    ['Diameter', product.diameter],
  ]
}

function DetailMessage({
  title,
  message,
}: {
  title: string
  message?: string
}) {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Whole House Solution
        </p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-secondary">
          {title}
        </h1>
        {message && <p className="mt-3 text-secondary-300">{message}</p>}
        <Button asChild className="mt-8 rounded-full bg-primary hover:bg-primary-600">
          <Link href="/products/whole-house-solution">Back to catalog</Link>
        </Button>
      </section>
    </main>
  )
}

export function WholeHouseProductDetail({
  productSlug,
}: WholeHouseProductDetailProps) {
  const { products, loading, error } = useWholeHouseCatalog()
  const result = (['housing', 'cartridge'] as const)
    .flatMap((category) =>
      products[category].map((product) => ({ category, product })),
    )
    .find((item) => item.product.slug === productSlug)

  if (loading) {
    return (
      <DetailMessage
        title="Loading product…"
        message="Retrieving the latest product details from Strapi."
      />
    )
  }
  if (error) {
    return <DetailMessage title="Unable to load product" message={error} />
  }
  if (!result) return <DetailMessage title="Product not found" />

  const { product, category } = result
  const categoryLabel = category === 'housing' ? 'Housing' : 'Cartridge'
  const specifications = product.details?.specs.length
    ? product.details.specs.map((spec) => [spec.label, spec.value])
    : getSpecifications(product, category)
  const compatibility =
    category === 'housing'
      ? `${product.length} × ${product.diameter} whole-house cartridges`
      : `${product.length} × ${product.diameter} whole-house housings`

  return (
    <main className="min-h-screen">
      <section className="container mx-auto px-4 py-8 lg:px-8 lg:py-14">
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/products/whole-house-solution"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-4" />
            Whole House Solution
          </Link>
        </nav>

        <div className="mb-7 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {categoryLabel}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold leading-tight text-secondary">
            {product.name}
          </h1>
          <p className="mt-2 font-mono text-sm font-semibold text-primary">
            Model: {product.model}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
          <aside className="lg:sticky lg:top-28">
            <WholeHouseProductVisual product={product} category={category} />
          </aside>

          <article className="space-y-8">
            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                Whole House · {categoryLabel}
              </p>
              <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-secondary">
                {product.name}
              </h1>
              <p className="mt-3 font-mono text-sm font-semibold text-primary">
                Model: {product.model}
              </p>
            </div>

            <section>
              <h2 className="font-heading text-2xl font-bold text-secondary">
                Product Information
              </h2>
              <p className="mt-4 text-base leading-7 text-secondary-300">
                {product.details?.description ||
                  getProductDescription(product, category)}
              </p>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary-100 bg-primary-50/45 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <House className="size-5" />
                  <h2 className="font-heading font-bold text-secondary">Application</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-secondary-300">
                  Whole-home, point-of-entry filtration
                </p>
              </div>
              <div className="rounded-xl border border-primary-100 bg-primary-50/45 p-4">
                <div className="flex items-center gap-2 text-primary">
                  {category === 'housing' ? (
                    <Wrench className="size-5" />
                  ) : (
                    <Droplets className="size-5" />
                  )}
                  <h2 className="font-heading font-bold text-secondary">
                    {category === 'housing' ? 'Connection' : 'Function'}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-secondary-300">
                  {category === 'housing' ? product.connection : product.removes}
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-secondary">
                Specifications
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {specifications.map(([label, value]) => (
                      <tr
                        key={label}
                        className="border-t border-border first:border-t-0"
                      >
                        <th className="w-2/5 bg-muted/55 px-4 py-3 text-left font-semibold text-secondary">
                          {label}
                        </th>
                        <td className="px-4 py-3 text-secondary-300">
                          {value || 'Not specified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {product.details?.accessories.length ? (
              <section>
                <h2 className="font-heading text-2xl font-bold text-secondary">
                  Accessories
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-secondary-300 md:text-base">
                  {product.details.accessories.map((accessory) => (
                    <li key={accessory}>{accessory}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="font-heading text-2xl font-bold text-secondary">
                Compatibility
              </h2>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-border p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-secondary">Matching format</p>
                  <p className="mt-1 text-sm leading-6 text-secondary-300">
                    Compatible with {compatibility}. Confirm model specifications
                    before installation.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <Button asChild className="rounded-full bg-primary px-6 hover:bg-primary-600">
                <Link href="/contact-us">Talk to Sales</Link>
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="size-4" />
                Match length and diameter before ordering
              </span>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
