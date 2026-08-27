import Image from 'next/image'
import type {
  CartridgeSpecification,
  WholeHouseCategory,
  WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'

const housingPattern =
  'repeating-linear-gradient(45deg, rgba(48, 111, 203, .16), rgba(48, 111, 203, .16) 4px, transparent 4px, transparent 8px)'
const cartridgePattern =
  'repeating-linear-gradient(0deg, rgba(48, 111, 203, .22), rgba(48, 111, 203, .22) 3px, transparent 3px, transparent 9px)'

type WholeHouseProductVisualProps = {
  product: WholeHouseProduct
  category: WholeHouseCategory
  specification?: CartridgeSpecification
}

export function WholeHouseProductVisual({
  product,
  category,
  specification,
}: WholeHouseProductVisualProps) {
  const imageSrc = specification?.imageSrc ?? product.details?.imageSrc
  const imageAlt = specification?.imageAlt ?? product.details?.imageAlt ?? product.name
  const displayModel = specification?.model ?? product.model
  const [length, diameter] = specification?.size.split(' × ') ?? [
    product.length,
    product.diameter,
  ]

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-50/80 via-white to-primary-50/50">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
        <span className="rounded-full border border-primary-100 bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
          {category === 'housing'
            ? 'Housing'
            : product.tags?.[0] ?? 'Cartridge'}
        </span>
        <span className="font-mono text-xs font-medium text-muted-foreground">
          {displayModel}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-contain p-10"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        ) : category === 'housing' ? (
          <div className="flex flex-col items-center drop-shadow-[0_18px_20px_rgba(48,111,203,.15)]">
            <span className="h-6 w-20 rounded-t-lg bg-primary-400" />
            <span
              className="h-[250px] w-[118px] rounded-[20px_20px_30px_30px] border-[5px] border-primary bg-white/75"
              style={{ backgroundImage: housingPattern }}
            />
          </div>
        ) : (
          <div className="relative h-[280px] w-[86px] rounded-full border-[5px] border-primary-200 bg-white shadow-[0_18px_30px_rgba(48,111,203,.15)]">
            <span
              className="absolute inset-x-5 inset-y-6 rounded-2xl"
              style={{ backgroundImage: cartridgePattern }}
            />
          </div>
        )}
      </div>

      <div className="absolute inset-x-5 bottom-5 z-10 flex justify-center gap-2">
        <span className="rounded-lg border border-primary-100 bg-white/90 px-3 py-1.5 text-xs text-secondary-300 shadow-sm">
          {length} length
        </span>
        <span className="rounded-lg border border-primary-100 bg-white/90 px-3 py-1.5 text-xs text-secondary-300 shadow-sm">
          {diameter} diameter
        </span>
      </div>
    </div>
  )
}
