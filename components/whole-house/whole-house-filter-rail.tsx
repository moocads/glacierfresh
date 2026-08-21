import type { WholeHouseFacet } from '@/lib/whole-house-catalog-data'

type WholeHouseFilterRailProps = {
  facets: WholeHouseFacet[]
  selected: Record<string, string[]>
  countFor: (facetKey: string, value: string) => number
  onToggle: (facetKey: string, value: string) => void
  isFacetEnabled?: (facetKey: string) => boolean
  className?: string
}

export function WholeHouseFilterRail({
  facets,
  selected,
  countFor,
  onToggle,
  isFacetEnabled = () => true,
  className = '',
}: WholeHouseFilterRailProps) {
  return (
    <div className={className}>
      {facets.map((facet) => {
        const facetEnabled = isFacetEnabled(facet.key)

        return (
          <fieldset
            key={facet.key}
            disabled={!facetEnabled}
            className="border-b border-primary-50 py-4 first:pt-0 last:border-0 disabled:opacity-50"
          >
            <legend className="mb-2.5 text-sm font-semibold text-secondary">
              {facet.label}
            </legend>
            {!facetEnabled && facet.key === 'size' ? (
              <p className="mb-2 text-xs leading-5 text-muted-foreground">
                Select a Micron Rating first.
              </p>
            ) : null}
            {facet.options.map((option) => {
              const checked = selected[facet.key]?.includes(option) ?? false
              const count = countFor(facet.key, option)

              return (
                <label
                  key={option}
                  className="flex cursor-pointer select-none items-center gap-2.5 py-1.5 text-sm text-secondary-300 transition-colors hover:text-secondary"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!facetEnabled || (count === 0 && !checked)}
                    onChange={() => onToggle(facet.key, option)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="relative size-[18px] shrink-0 rounded-[5px] border-2 border-primary-100 bg-white transition peer-checked:border-primary peer-checked:bg-primary peer-disabled:bg-muted after:absolute after:left-[5px] after:top-[1px] after:hidden after:h-[9px] after:w-[5px] after:rotate-45 after:border-b-2 after:border-r-2 after:border-white after:content-[''] peer-checked:after:block"
                  />
                  <span>{option}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {count}
                  </span>
                </label>
              )
            })}
          </fieldset>
        )
      })}
    </div>
  )
}
