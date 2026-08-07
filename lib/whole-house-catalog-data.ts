export type WholeHouseCategory = 'housing' | 'cartridge'

export type WholeHouseProduct = {
  model: string
  name: string
  slug: string
  type?: string
  length?: string
  diameter?: string
  connection?: string
  gauge?: string
  color?: string
  media?: string
  micron?: string
  capacity?: string
  tags?: string[]
  details?: {
    imageSrc?: string
    galleryImages: string[]
    imageAlt: string
    description?: string
    specs: { label: string; value: string }[]
    accessories: string[]
  }
}

export type WholeHouseFacet = {
  key: string
  label: string
  options: string[]
}

export const WHOLE_HOUSE_CATEGORY_META: {
  id: WholeHouseCategory
  label: string
}[] = [
  { id: 'housing', label: 'Housings' },
  { id: 'cartridge', label: 'Cartridges' },
]

export const WHOLE_HOUSE_FACETS: Record<
  WholeHouseCategory,
  WholeHouseFacet[]
> = {
  housing: [
    {
      key: 'type',
      label: 'System type',
      options: ['Standard', 'Heavy-Duty', '2-Stage HD', '3-Stage HD'],
    },
    { key: 'length', label: 'Length', options: ['10"', '20"'] },
    { key: 'diameter', label: 'Diameter', options: ['2.5"', '4.5"'] },
    {
      key: 'connection',
      label: 'Connection',
      options: ['¾" NPT', '1" NPT'],
    },
    { key: 'gauge', label: 'Pressure gauge', options: ['Yes', 'No'] },
    { key: 'color', label: 'Color', options: ['White', 'Clear', 'Black', 'Blue'] },
  ],
  cartridge: [
    {
      key: 'tags',
      label: 'Filtration targets',
      options: ['Sediment', 'Rust', 'Coarse Sand', 'Sand', 'Fine Sand'],
    },
    {
      key: 'capacity',
      label: 'Capacity',
      options: ['3–6 months', '2–4 months', '1–3 months'],
    },
    {
      key: 'media',
      label: 'Media',
      options: [
        'Melt-blown',
        'Pleated · reusable',
        'String-wound',
        'Carbon block',
        'Anti-scale',
      ],
    },
    { key: 'diameter', label: 'Diameter', options: ['2.5"', '4.5"'] },
    { key: 'length', label: 'Length', options: ['10"', '20"'] },
  ],
}
