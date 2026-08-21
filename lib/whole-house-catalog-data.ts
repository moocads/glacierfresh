export type WholeHouseCategory = 'housing' | 'cartridge'

export type CartridgeSpecification = {
  micronRating: string
  size: string
  model: string
  flowRate: string
  capacity: string
}

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
  specifications?: CartridgeSpecification[]
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
      key: 'micronRating',
      label: 'Micron Rating',
      options: ['20 Micron', '5 Micron', '1 Micron', 'Not rated'],
    },
    {
      key: 'size',
      label: 'Size',
      options: ['10" × 2.5"', '20" × 2.5"', '10" × 4.5"', '20" × 4.5"'],
    },
    {
      key: 'tags',
      label: 'Filtration targets',
      options: ['Sediment', 'Rust', 'Coarse Sand', 'Sand', 'Fine Sand'],
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
  ],
}
