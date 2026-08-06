'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import {
  WHOLE_HOUSE_CATEGORY_META,
  WHOLE_HOUSE_FACETS,
  type WholeHouseCategory,
  type WholeHouseProduct,
} from '@/lib/whole-house-catalog-data'
import { useWholeHouseCatalog } from '@/lib/use-whole-house-catalog'
import { WholeHouseFilterRail } from '@/components/whole-house/whole-house-filter-rail'
import { WholeHouseProductCard } from '@/components/whole-house/whole-house-product-card'

type SelectedFilters = Record<string, string[]>

export function WholeHouseCatalog() {
  const [category, setCategory] = useState<WholeHouseCategory>('housing')
  const [selected, setSelected] = useState<SelectedFilters>({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { products: productsByCategory, loading, error } = useWholeHouseCatalog()

  const facets = WHOLE_HOUSE_FACETS[category]
  const products = productsByCategory[category]

  const facetValue = (product: WholeHouseProduct, key: string) => {
    const value = product[key as keyof WholeHouseProduct]
    return typeof value === 'string' ? value : undefined
  }

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        facets.every((facet) => {
          const selectedValues = selected[facet.key]
          return (
            !selectedValues?.length ||
            selectedValues.includes(facetValue(product, facet.key) ?? '')
          )
        }),
      ),
    [facets, products, selected],
  )

  function countFor(facetKey: string, value: string) {
    return products.filter((product) =>
      facets.every((facet) => {
        if (facet.key === facetKey) return facetValue(product, facet.key) === value
        const selectedValues = selected[facet.key]
        return (
          !selectedValues?.length ||
          selectedValues.includes(facetValue(product, facet.key) ?? '')
        )
      }),
    ).length
  }

  function toggleFilter(facetKey: string, value: string) {
    setSelected((current) => {
      const currentValues = current[facetKey] ?? []
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return { ...current, [facetKey]: nextValues }
    })
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
                className={`mr-5 flex shrink-0 items-center gap-2 border-b-2 py-4 text-[15px] font-semibold transition-colors ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-secondary'
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
                    key={product.model}
                    product={product}
                    category={category}
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
