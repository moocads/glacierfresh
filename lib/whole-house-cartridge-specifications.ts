import type { CartridgeSpecification } from '@/lib/whole-house-catalog-data'

const SIZE_LABELS = {
  '10-ST': '10" × 2.5"',
  '20-ST': '20" × 2.5"',
  '10-HD': '10" × 4.5"',
  '20-HD': '20" × 4.5"',
} as const

type SizeKey = keyof typeof SIZE_LABELS
type RatedMicron = '20 Micron' | '5 Micron' | '1 Micron'

const RATED_FLOW_RATES: Record<RatedMicron, Record<SizeKey, string>> = {
  '20 Micron': {
    '10-ST': '5 gpm @ 30 psi (18.9 Lpm @ 2.1 bar)',
    '20-ST': '7 gpm @ 30 psi (26.5 Lpm @ 2.1 bar)',
    '10-HD': '12 gpm @ 30 psi (45.4 Lpm @ 2.1 bar)',
    '20-HD': '25 gpm @ 30 psi (94.6 Lpm @ 2.1 bar)',
  },
  '5 Micron': {
    '10-ST': '3 gpm @ 30 psi (11.4 Lpm @ 2.1 bar)',
    '20-ST': '5 gpm @ 30 psi (18.9 Lpm @ 2.1 bar)',
    '10-HD': '10 gpm @ 30 psi (37.9 Lpm @ 2.1 bar)',
    '20-HD': '20 gpm @ 30 psi (75.7 Lpm @ 2.1 bar)',
  },
  '1 Micron': {
    '10-ST': '3 gpm @ 30 psi (11.4 Lpm @ 2.1 bar)',
    '20-ST': '5 gpm @ 30 psi (18.9 Lpm @ 2.1 bar)',
    '10-HD': '10 gpm @ 30 psi (37.9 Lpm @ 2.1 bar)',
    '20-HD': '20 gpm @ 30 psi (75.7 Lpm @ 2.1 bar)',
  },
}

const RATED_CAPACITIES: Record<RatedMicron, string> = {
  '20 Micron': '3–6 months',
  '5 Micron': '2–4 months',
  '1 Micron': '1–3 months',
}

const CARBON_CAPACITIES: Record<SizeKey, string> = {
  '10-ST': '1–3 months',
  '20-ST': '2–4 months',
  '10-HD': '3–6 months',
  '20-HD': '3–6 months',
}

const ANTI_SCALE_CAPACITIES: Record<SizeKey, string> = {
  '10-ST': '3–6 months',
  '20-ST': '6–12 months',
  '10-HD': '6–12 months',
  '20-HD': '12–24 months',
}

const NON_COARSE_FLOW_RATES: Record<SizeKey, string> = {
  '10-ST': '3 gpm @ 30 psi (11.4 Lpm @ 2.1 bar)',
  '20-ST': '5 gpm @ 30 psi (18.9 Lpm @ 2.1 bar)',
  '10-HD': '10 gpm @ 30 psi (37.9 Lpm @ 2.1 bar)',
  '20-HD': '20 gpm @ 30 psi (75.7 Lpm @ 2.1 bar)',
}

/**
 * Builds the specification records defined in `全屋产品族谱_2 (1).xlsx`.
 * The CMS continues to own product copy and media; its base model identifies the
 * media and physical size used to look up these selectable specifications.
 */
export function getCartridgeSpecifications(
  baseModel: string,
): CartridgeSpecification[] {
  const normalizedModel = baseModel.trim().toUpperCase()
  const match = /^FZW(10|20)(ST|HD)-(PP|PL|SW|CB|AS)$/.exec(normalizedModel)
  if (!match) return []

  const [, length, diameter, mediaCode] = match
  const sizeKey = `${length}-${diameter}` as SizeKey
  const size = SIZE_LABELS[sizeKey]

  if (mediaCode === 'PP' || mediaCode === 'PL' || mediaCode === 'SW') {
    const microns: RatedMicron[] = ['20 Micron', '5 Micron', '1 Micron']

    return microns.map((micronRating) => ({
      micronRating,
      size,
      model: `${normalizedModel}-${micronRating.split(' ')[0]}`,
      flowRate: RATED_FLOW_RATES[micronRating][sizeKey],
      capacity: RATED_CAPACITIES[micronRating],
    }))
  }

  if (mediaCode === 'CB') {
    return [
      {
        micronRating: '5 Micron',
        size,
        model: normalizedModel,
        flowRate: NON_COARSE_FLOW_RATES[sizeKey],
        capacity: CARBON_CAPACITIES[sizeKey],
      },
    ]
  }

  return [
    {
      micronRating: 'Not rated',
      size,
      model: normalizedModel,
      flowRate: NON_COARSE_FLOW_RATES[sizeKey],
      capacity: ANTI_SCALE_CAPACITIES[sizeKey],
    },
  ]
}
