'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  WHOLE_HOUSE_CATEGORY_META,
  WHOLE_HOUSE_FACETS,
  type CartridgeSpecification,
  type WholeHouseCategory,
  type WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'
import {
  buildCartridgeFacets,
  useWholeHouseCatalog,
} from '@/lib/use-whole-house-catalog'
import { WholeHouseFilterRail } from '@/components/whole-house/whole-house-filter-rail'
import { WholeHouseProductCard } from '@/components/whole-house/whole-house-product-card'

type SelectedFilters = Record<string, string[]>

export function WholeHouseCatalog() {
  const [category, setCategory] = useState<WholeHouseCategory>('housing')
  const [selected, setSelected] = useState<SelectedFilters>({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { products: productsByCategory, loading, error } = useWholeHouseCatalog()

  const products = productsByCategory[category]
  const facets =
    category === 'cartridge'
      ? buildCartridgeFacets(productsByCategory.cartridge)
      : WHOLE_HOUSE_FACETS.housing

  const facetValues = (product: WholeHouseProduct, key: string): string[] => {
    if (key === 'micronRating') {
      return product.specifications?.map((spec) => spec.micronRating) ?? []
    }
    if (key === 'size') {
      return product.specifications?.map((spec) => spec.size) ?? []
    }
    if (key === 'tags') {
      return product.specifications?.flatMap((spec) => spec.tags ?? []) ?? []
    }
    const value = product[key as keyof WholeHouseProduct]
    if (typeof value === 'string') return [value]
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : []
  }

  function matchesFilters(
    product: WholeHouseProduct,
    filters: SelectedFilters,
  ) {
    const micronRatings = filters.micronRating ?? []
    const sizes = filters.size ?? []
    const tags = filters.tags ?? []
    const hasSpecificationFilters =
      micronRatings.length > 0 || sizes.length > 0 || tags.length > 0
    const matchesSpecification =
      !hasSpecificationFilters ||
      product.specifications?.some(
        (spec) =>
          (!micronRatings.length || micronRatings.includes(spec.micronRating)) &&
          (!sizes.length || sizes.includes(spec.size)) &&
          (!tags.length || tags.some((tag) => spec.tags?.includes(tag))),
      )

    if (!matchesSpecification) return false

    return facets.every((facet) => {
      if (
        facet.key === 'micronRating' ||
        facet.key === 'size' ||
        facet.key === 'tags'
      ) {
        return true
      }
      const selectedValues = filters[facet.key]
      return (
        !selectedValues?.length ||
        selectedValues.some((value) =>
          facetValues(product, facet.key).includes(value),
        )
      )
    })
  }

  const filteredProducts = products.filter((product) =>
    matchesFilters(product, selected),
  )

  function countFor(facetKey: string, value: string) {
    const candidateFilters = { ...selected, [facetKey]: [value] }
    return products.filter((product) =>
      matchesFilters(product, candidateFilters),
    ).length
  }

  function toggleFilter(facetKey: string, value: string) {
    setSelected((current) => {
      const currentValues = current[facetKey] ?? []
      const isSpecificationFilter =
        category === 'cartridge' &&
        (facetKey === 'micronRating' || facetKey === 'size')

      if (isSpecificationFilter) {
        const isClearing = currentValues.includes(value)
        const next = {
          ...current,
          [facetKey]: isClearing ? [] : [value],
        }

        if (facetKey === 'size') next.micronRating = []
        return next
      }

      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return { ...current, [facetKey]: nextValues }
    })
  }

  function matchedSpecification(
    product: WholeHouseProduct,
  ): CartridgeSpecification | undefined {
    const size = selected.size?.[0]
    const micronRating = selected.micronRating?.[0]

    return (
      product.specifications?.find(
        (spec) =>
          (!size || spec.size === size) &&
          (!micronRating || spec.micronRating === micronRating),
      ) ?? product.specifications?.[0]
    )
  }

  function switchCategory(nextCategory: WholeHouseCategory) {
    setCategory(nextCategory)
    setSelected({})
    setMobileFiltersOpen(false)
  }

  const activeFilters = facets.flatMap((facet) =>
    (selected[facet.key] ?? []).map((value) => ({
      key: facet.key,
      value,
    })),
  )
  const categoryLabel = WHOLE_HOUSE_CATEGORY_META.find(
    (item) => item.id === category,
  )?.label.toLowerCase()

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 lg:px-8">
        <div className="rounded-xl border border-border bg-muted/30 px-6 py-14 text-center text-muted-foreground">
          Loading Whole House products from Strapi…
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-16 lg:px-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center text-secondary-300">
          <strong className="mb-1.5 block text-base text-secondary">
            Unable to load Whole House products
          </strong>
          {error}
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="sticky top-20 z-30 border-b border-border bg-white/95 backdrop-blur-sm">
        <div
          className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 lg:px-8"
          role="tablist"
          aria-label="Whole house product category"
        >
          {WHOLE_HOUSE_CATEGORY_META.map((item) => {
            const active = item.id === category

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchCategory(item.id)}
                className={`mr-3 flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-[17px] font-bold transition-colors ${
                  active
                    ? 'border-primary bg-primary-50 text-primary'
                    : 'border-transparent text-secondary-300 hover:bg-muted/50 hover:text-secondary'
                }`}
              >
                {item.label}
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                    active
                      ? 'border-primary-100 bg-primary-50 text-primary-700'
                      : 'border-border bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {productsByCategory[item.id].length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-5 py-7 pb-16 lg:grid-cols-[250px_1fr] lg:gap-8">
          <aside
            id="whole-house-filters"
            aria-label="Product filters"
            className="lg:sticky lg:top-[148px]"
          >
            <WholeHouseFilterRail
              facets={facets}
              selected={selected}
              countFor={countFor}
              onToggle={toggleFilter}
              isFacetEnabled={(facetKey) =>
                facetKey !== 'micronRating' || Boolean(selected.size?.length)
              }
              className={`${
                mobileFiltersOpen ? 'block' : 'hidden'
              } rounded-xl border border-border bg-white p-4 shadow-sm lg:block lg:border-0 lg:p-0 lg:shadow-none`}
            />
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                aria-expanded={mobileFiltersOpen}
                aria-controls="whole-house-filters"
                onClick={() => setMobileFiltersOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium text-secondary-300 shadow-sm lg:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </button>

              <span className="text-sm text-muted-foreground" aria-live="polite">
                <strong className="font-semibold text-secondary">
                  {filteredProducts.length}
                </strong>{' '}
                of {products.length} {categoryLabel}
              </span>

              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={`${filter.key}-${filter.value}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 py-1 pl-3 pr-1.5 text-xs font-medium text-primary-700"
                  >
                    {filter.value}
                    <button
                      type="button"
                      aria-label={`Remove ${filter.value} filter`}
                      onClick={() => toggleFilter(filter.key, filter.value)}
                      className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-primary-100"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>

              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected({})}
                  className="ml-auto text-sm font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(215px,1fr))] gap-4">
                {filteredProducts.map((product) => (
                  <WholeHouseProductCard
                    key={product.slug}
                    product={product}
                    category={category}
                    specification={matchedSpecification(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
                <strong className="mb-1.5 block text-base text-secondary">
                  No products match those specifications
                </strong>
                Try removing a filter to widen the results.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
