'use client'

import { useMemo } from 'react'
import {
  type WholeHouseCategory,
  type WholeHouseFacet,
  type WholeHouseProduct,
  type CartridgeSpecification,
} from '@/lib/whole-house-catalog-data'
import {
  useCmsProducts,
  type CmsCartridgeVariant,
  type CmsProduct,
  type CmsWholeHouseSpec,
} from '@/lib/use-cms-products'
import {
  useCmsCartridgeProducts,
  type CmsCartridgeProduct,
  type CmsMedia,
} from '@/lib/use-cms-cartridge-products'
import { getCartridgeSpecifications } from '@/lib/whole-house-cartridge-specifications'

const systemTypeLabels: Record<
  NonNullable<CmsWholeHouseSpec['system_type']>,
  string
> = {
  standard: 'Standard',
  heavy_duty: 'Heavy-Duty',
  two_stage_hd: '2-Stage HD',
  three_stage_hd: '3-Stage HD',
}

const lengthLabels: Record<NonNullable<CmsWholeHouseSpec['length']>, string> = {
  ten_inch: '10"',
  twenty_inch: '20"',
}

const diameterLabels: Record<
  NonNullable<CmsWholeHouseSpec['diameter']>,
  string
> = {
  inch_2_5: '2.5"',
  inch_4_5: '4.5"',
}

const connectionLabels: Record<
  NonNullable<CmsWholeHouseSpec['connection']>,
  string
> = {
  npt_3_4: '¾" NPT',
  npt_1: '1" NPT',
}

const capacityLabels: Record<
  NonNullable<CmsWholeHouseSpec['capacity']>,
  string
> = {
  m3_6: '3–6 months',
  m2_4: '2–4 months',
  m1_3: '1–3 months',
}

const micronRatingLabels: Record<
  NonNullable<CmsCartridgeVariant['micron_rating']>,
  string
> = {
  micron_20: '20 Micron',
  micron_5: '5 Micron',
  micron_1: '1 Micron',
  not_rated: 'Not rated',
}

const replacementIntervalLabels: Record<
  NonNullable<CmsCartridgeVariant['replacement_interval']>,
  string
> = {
  m1_3: '1–3 months',
  m2_4: '2–4 months',
  m3_6: '3–6 months',
  m6_12: '6–12 months',
  m12_24: '12–24 months',
}

const tagFields = [
  ['Sediment', 'Sediment'],
  ['Rust', 'Rust'],
  ['Coarse_Sand', 'Coarse Sand'],
  ['Sand', 'Sand'],
  ['Fine_Sand', 'Fine Sand'],
] as const satisfies ReadonlyArray<readonly [keyof CmsWholeHouseSpec, string]>

const mediaLabels: Record<
  NonNullable<CmsWholeHouseSpec['filtration_media']>,
  string
> = {
  melt_blown: 'Melt-blown',
  pleated: 'Pleated · reusable',
  string_wound: 'String-wound',
  carbon_block: 'Carbon block',
  anti_scale: 'Anti-scale',
}

function labelFor<T extends string>(
  value: T | null | undefined,
  labels: Record<T, string>,
) {
  return value ? labels[value] : undefined
}

function numberValue(value: number | string | null | undefined) {
  if (value == null || value === '') return undefined
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/0+$/, '')
}

function mediaUrl(media: CmsMedia | null | undefined) {
  return (
    media?.formats?.large?.url ??
    media?.formats?.medium?.url ??
    media?.formats?.small?.url ??
    media?.url
  )
}

function textFromBlockNode(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const value = node as { text?: unknown; children?: unknown }
  if (typeof value.text === 'string') return value.text
  return Array.isArray(value.children)
    ? value.children.map(textFromBlockNode).join('')
    : ''
}

function benefitsFromBlocks(blocks: unknown[] | null | undefined) {
  return (blocks ?? [])
    .map((block) => textFromBlockNode(block).trim())
    .filter((text): text is string => Boolean(text))
}

function micronLabel(name: string | null | undefined) {
  const trimmed = name?.trim()
  if (!trimmed) return undefined
  if (/^not\s+rated$/i.test(trimmed)) return 'Not rated'
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*micron$/i)
  return match ? `${match[1]} Micron` : trimmed
}

function cartridgeSizeLabel(length: number, diameter: number) {
  return `${formatNumber(length)}" × ${formatNumber(diameter)}"`
}

function capacityLabel(minimum: number, maximum: number) {
  return minimum === maximum
    ? `${minimum} months`
    : `${minimum}–${maximum} months`
}

function mapCmsCartridgeSpecifications(
  variants: CmsCartridgeVariant[] | null | undefined,
  baseModel: string,
  size: string,
): CartridgeSpecification[] {
  if (!variants?.length) return getCartridgeSpecifications(baseModel)

  return variants
    .filter((variant) => variant.isActive !== false)
    .sort(
      (a, b) =>
        (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .flatMap((variant) => {
      const micronRating = labelFor(variant.micron_rating, micronRatingLabels)
      const flowRateGpm = numberValue(variant.flow_rate_gpm)
      const flowRateLpm = numberValue(variant.flow_rate_lpm)
      const pressurePsi = numberValue(variant.pressure_psi)
      const pressureBar = numberValue(variant.pressure_bar)
      const capacity = labelFor(
        variant.replacement_interval,
        replacementIntervalLabels,
      )

      if (
        !micronRating ||
        flowRateGpm == null ||
        flowRateLpm == null ||
        pressurePsi == null ||
        pressureBar == null ||
        !capacity
      ) {
        return []
      }

      return [
        {
          micronRating,
          size,
          model: variant.display_model?.trim() || baseModel,
          flowRate: `${formatNumber(flowRateGpm)} gpm @ ${formatNumber(pressurePsi)} psi (${formatNumber(flowRateLpm)} Lpm @ ${formatNumber(pressureBar)} bar)`,
          capacity,
        },
      ]
    })
}

function mapCmsProduct(product: CmsProduct): {
  category: WholeHouseCategory
  product: WholeHouseProduct
  sortOrder: number
} | null {
  const spec = product.wholeHouseSpec
  const model = product.model?.trim()
  if (!spec || !model || product.categorySlug !== 'whole-house-solution') return null

  const media = labelFor(spec.filtration_media, mediaLabels)
  const name = product.name?.trim() || media || model
  const length = labelFor(spec.length, lengthLabels) ?? 'Not specified'
  const diameter = labelFor(spec.diameter, diameterLabels) ?? 'Not specified'
  const shared = {
    model,
    name,
    slug: product.slug,
    length,
    diameter,
    details: {
      imageSrc: product.imageSrc,
      galleryImages: product.galleryImages,
      imageAlt: product.imageAlt ?? name,
      description: product.description,
      specs: product.specs ?? [],
      accessories: product.accessories ?? [],
    },
  }

  if (spec.kind === 'housing') {
    return {
      category: 'housing',
      sortOrder: product.sortOrder ?? Number.MAX_SAFE_INTEGER,
      product: {
        ...shared,
        type: labelFor(spec.system_type, systemTypeLabels) ?? 'Not specified',
        connection:
          labelFor(spec.connection, connectionLabels) ?? 'Not specified',
        gauge:
          spec.pressure_gauge == null
            ? 'Not specified'
            : spec.pressure_gauge
              ? 'Yes'
              : 'No',
        color: spec.color
          ? spec.color.charAt(0).toUpperCase() + spec.color.slice(1)
          : 'Not specified',
      },
    }
  }

  return {
    category: 'cartridge',
    sortOrder: product.sortOrder ?? Number.MAX_SAFE_INTEGER,
    product: {
      ...shared,
      media: media ?? 'Not specified',
      micron: spec.micron_rating?.trim() || 'Not specified',
      capacity: labelFor(spec.capacity, capacityLabels),
      specifications: mapCmsCartridgeSpecifications(
        spec.cartridge_variants,
        model,
        `${length} × ${diameter}`,
      ),
      tags: tagFields
        .filter(([field]) => spec[field] === true)
        .map(([, label]) => label),
    },
  }
}

function mapCmsCartridgeProduct(product: CmsCartridgeProduct): {
  product: WholeHouseProduct
  sortOrder: number
} | null {
  if (
    product.isActive === false ||
    product.category?.slug !== 'whole-house-solution'
  ) {
    return null
  }

  const name = product.name?.trim()
  const slug = product.slug?.trim()
  if (!name || !slug) return null

  const specifications: CartridgeSpecification[] = (product.sizeVariants ?? [])
    .filter(
      (variant) =>
        variant.isActive !== false && variant.size?.isActive !== false,
    )
    .sort(
      (a, b) =>
        (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .flatMap((variant) => {
      const length = numberValue(variant.size?.lengthInches)
      const diameter = numberValue(variant.size?.diameterInches)
      if (length == null || diameter == null) return []

      const size = cartridgeSizeLabel(length, diameter)
      const sizeCode = variant.size?.sizeCode?.trim() || variant.size?.name?.trim()
      const imageSrc = mediaUrl(variant.featureImage)
      const imageAlt =
        variant.featureImage?.alternativeText?.trim() || `${name} ${size}`
      const galleryImages = (variant.galleryImages ?? [])
        .map(mediaUrl)
        .filter((url): url is string => Boolean(url))

      return (variant.micronConfigurations ?? [])
        .filter(
          (configuration) =>
            configuration.isActive !== false &&
            configuration.micronRating?.isActive !== false,
        )
        .sort(
          (a, b) =>
            (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        )
        .flatMap((configuration) => {
          const micronRating = micronLabel(configuration.micronRating?.name)
          const model = configuration.displayModel?.trim()
          const flowRateGpm = numberValue(configuration.flowRateGpm)
          const flowRateLpm = numberValue(configuration.flowRateLpm)
          const pressurePsi = numberValue(configuration.testPressurePsi)
          const pressureBar = numberValue(configuration.testPressureBar)
          const capacityMin = configuration.capacityMinMonths
          const capacityMax = configuration.capacityMaxMonths
          if (
            !micronRating ||
            !model ||
            flowRateGpm == null ||
            flowRateLpm == null ||
            pressurePsi == null ||
            pressureBar == null ||
            capacityMin == null ||
            capacityMax == null
          ) {
            return []
          }

          const tags = (configuration.filtrationCapabilities ?? [])
            .filter((capability) => capability.isActive !== false)
            .sort(
              (a, b) =>
                (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
                (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
            )
            .map((capability) => capability.name?.trim())
            .filter((tag): tag is string => Boolean(tag))

          return [
            {
              key: `${slug}:${sizeCode ?? size}:${configuration.micronRating?.code ?? micronRating}:${model}`,
              micronRating,
              micronValue: numberValue(configuration.micronRating?.value),
              size,
              sizeCode,
              model,
              flowRate: `${formatNumber(flowRateGpm)} gpm @ ${formatNumber(pressurePsi)} psi (${formatNumber(flowRateLpm)} Lpm @ ${formatNumber(pressureBar)} bar)`,
              capacity: capacityLabel(capacityMin, capacityMax),
              testPressure: `${formatNumber(pressurePsi)} psi (${formatNumber(pressureBar)} bar)`,
              filtrationEfficiencyLevel:
                configuration.filtrationEfficiencyLevel ?? undefined,
              initialPressureDropLevel:
                configuration.initialPressureDropLevel ?? undefined,
              tags,
              imageSrc,
              galleryImages,
              imageAlt,
            },
          ]
        })
    })

  const first = specifications[0]
  if (!first) return null

  const allTags = [...new Set(specifications.flatMap((spec) => spec.tags ?? []))]
  const common = product.commonSpecifications

  return {
    sortOrder: product.sortOrder ?? Number.MAX_SAFE_INTEGER,
    product: {
      model: first.model,
      name,
      slug,
      length: first.size.split(' × ')[0],
      diameter: first.size.split(' × ')[1],
      media: common?.filtrationMedia?.trim() || 'Not specified',
      micron: first.micronRating,
      capacity: first.capacity,
      tags: allTags,
      specifications,
      details: {
        imageSrc: first.imageSrc,
        galleryImages: first.galleryImages ?? [],
        imageAlt: first.imageAlt ?? name,
        description: product.description?.trim() || undefined,
        benefits: benefitsFromBlocks(common?.benefits),
        pressureRange: common?.pressureRange?.trim() || undefined,
        temperatureRange: common?.temperatureRange?.trim() || undefined,
        specs: [],
        accessories: [],
      },
    },
  }
}

function uniqueValues(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function sortMicronLabels(values: string[]) {
  return [...values].sort((a, b) => {
    if (a === 'Not rated') return 1
    if (b === 'Not rated') return -1
    return (Number.parseFloat(b) || 0) - (Number.parseFloat(a) || 0)
  })
}

export function buildCartridgeFacets(
  products: WholeHouseProduct[],
): WholeHouseFacet[] {
  const specifications = products.flatMap((product) => product.specifications ?? [])

  return [
    {
      key: 'size',
      label: 'Size',
      options: uniqueValues(specifications.map((spec) => spec.size)),
    },
    {
      key: 'micronRating',
      label: 'Micron Rating',
      options: sortMicronLabels(
        uniqueValues(specifications.map((spec) => spec.micronRating)),
      ),
    },
    {
      key: 'tags',
      label: 'Filtration targets',
      options: uniqueValues(specifications.flatMap((spec) => spec.tags ?? [])),
    },
    {
      key: 'media',
      label: 'Media',
      options: uniqueValues(products.map((product) => product.media)),
    },
  ]
}

export function useWholeHouseCatalog() {
  const {
    products: cmsProducts,
    loading: productsLoading,
    error: productsError,
  } = useCmsProducts()
  const {
    products: cmsCartridgeProducts,
    loading: cartridgesLoading,
    error: cartridgesError,
  } = useCmsCartridgeProducts()

  const products = useMemo(() => {
    const legacyProducts = cmsProducts
      .filter((product) => product.isActive !== false)
      .map(mapCmsProduct)
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder || a.product.model.localeCompare(b.product.model),
      )

    const cartridges = cmsCartridgeProducts
      .map(mapCmsCartridgeProduct)
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          a.product.name.localeCompare(b.product.name),
      )

    return {
      housing: legacyProducts
        .filter((item) => item.category === 'housing')
        .map((item) => item.product),
      cartridge: cartridges.map((item) => item.product),
    } satisfies Record<WholeHouseCategory, WholeHouseProduct[]>
  }, [cmsCartridgeProducts, cmsProducts])

  return {
    products,
    loading: productsLoading || cartridgesLoading,
    error: productsError ?? cartridgesError,
  }
}
