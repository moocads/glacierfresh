import type { WholeHouseFacet } from '@/lib/whole-house-catalog-data'

type WholeHouseFilterRailProps = {
  facets: WholeHouseFacet[]
  selected: Record<string, string[]>
  countFor: (facetKey: string, value: string) => number
  onToggle: (facetKey: string, value: string) => void
  className?: string
}

export function WholeHouseFilterRail({
  facets,
  selected,
  countFor,
  onToggle,
  className = '',
}: WholeHouseFilterRailProps) {
  return (
    <div className={className}>
      {facets.map((facet) => (
        <fieldset
          key={facet.key}
          className="border-b border-primary-50 py-4 first:pt-0 last:border-0"
        >
          <legend className="mb-2.5 text-sm font-semibold text-secondary">
            {facet.label}
          </legend>
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
                  disabled={count === 0 && !checked}
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
      ))}
    </div>
  )
}
