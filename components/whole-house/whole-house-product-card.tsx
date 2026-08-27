import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type {
  CartridgeSpecification,
  WholeHouseCategory,
  WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'

const housingPattern =
  'repeating-linear-gradient(45deg, rgba(48, 111, 203, .16), rgba(48, 111, 203, .16) 3px, transparent 3px, transparent 6px)'
const cartridgePattern =
  'repeating-linear-gradient(0deg, rgba(48, 111, 203, .22), rgba(48, 111, 203, .22) 2px, transparent 2px, transparent 6px)'

type WholeHouseProductCardProps = {
  product: WholeHouseProduct
  category: WholeHouseCategory
  specification?: CartridgeSpecification
}

export function WholeHouseProductCard({
  product,
  category,
  specification,
}: WholeHouseProductCardProps) {
  const activeTags = specification?.tags ?? product.tags ?? []
  const visibleTags = activeTags.slice(0, 3)
  const remainingTagCount = Math.max(
    activeTags.length - visibleTags.length,
    0,
  )
  const specs =
    category === 'housing'
      ? [
          product.type,
          `${product.length} × ${product.diameter}`,
          product.connection,
          product.gauge === 'Yes' ? 'Gauge' : null,
          product.color,
        ]
      : [
          product.media,
          specification?.size ?? `${product.length} × ${product.diameter}`,
          specification?.micronRating ?? product.micron,
          specification?.flowRate,
          specification?.capacity ?? product.capacity,
        ]
  const detailHref = specification
    ? `/products/whole-house-solution/${product.slug}?micron=${encodeURIComponent(specification.micronRating)}&size=${encodeURIComponent(specification.size)}`
    : `/products/whole-house-solution/${product.slug}`

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition duration-200 hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-[0_1px_2px_rgba(8,36,73,.04),0_10px_28px_rgba(8,36,73,.08)]">
      <div className="relative flex aspect-[5/4] items-center justify-center bg-primary-50/35">
        {specification?.imageSrc ?? product.details?.imageSrc ? (
          <Image
            src={specification?.imageSrc ?? product.details!.imageSrc!}
            alt={specification?.imageAlt ?? product.details!.imageAlt}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 220px, (min-width: 768px) 30vw, 100vw"
          />
        ) : category === 'housing' ? (
          <div className="relative flex flex-col items-center">
            <span className="h-2.5 w-7 rounded-t-sm bg-primary-300" />
            <span
              className="h-[92px] w-11 rounded-[8px_8px_12px_12px] border-2 border-primary bg-primary/5"
              style={{
                backgroundImage: housingPattern,
                backgroundClip: 'padding-box',
              }}
            />
          </div>
        ) : (
          <>
            <div className="relative h-[100px] w-[30px] rounded-full border-2 border-primary-200 bg-primary-50">
              <span
                className="absolute inset-x-2.5 inset-y-2 rounded-lg"
                style={{ backgroundImage: cartridgePattern }}
              />
            </div>
            <span className="absolute left-3 top-3 rounded-full border border-primary-100 bg-white px-2.5 py-1 text-[11px] font-semibold text-primary-700">
              {activeTags[0] ?? 'Cartridge'}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-heading text-base font-semibold text-secondary">
          {product.name}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {specification?.model ?? product.model}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specs.filter(Boolean).map((spec) => (
            <span
              key={spec}
              className="rounded-md border border-border bg-muted/55 px-2 py-1 text-[11px] text-secondary-300"
            >
              {spec}
            </span>
          ))}
        </div>
        {category === 'cartridge' && visibleTags.length > 0 ? (
          <div
            className="mt-2.5 flex flex-wrap gap-1.5"
            aria-label="Filtration targets"
          >
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary-100 bg-primary-50 px-2 py-1 text-[11px] font-medium text-primary-700"
              >
                {tag}
              </span>
            ))}
            {remainingTagCount > 0 ? (
              <span className="rounded-full border border-primary-100 bg-white px-2 py-1 text-[11px] font-medium text-primary-700">
                +{remainingTagCount}
              </span>
            ) : null}
          </div>
        ) : null}
        <Link
          href={detailHref}
          className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          View details
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
