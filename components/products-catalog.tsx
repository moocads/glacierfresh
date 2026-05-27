'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  type CatalogProduct,
} from '@/lib/products-catalog-data'
import { useCmsCategories } from '@/lib/use-cms-categories'
import { useCmsProducts } from '@/lib/use-cms-products'

const NAV_OFFSET_PX = 140

type CategoryId = string
type ProductWithSpecs = CatalogProduct & {
  specs?: { label: string; value: string }[]
  accessories?: string[]
}
type CategoryForCatalog = {
  id: string
  title: string
  navLabel: string
  products: ProductWithSpecs[]
}

function scrollToSection(id: CategoryId) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(null, '', `#${id}`)
  }
}

/** Section whose heading has passed the sticky nav anchor — works for uneven section heights. */
function getActiveCategoryId(categories: CategoryForCatalog[]): CategoryId | null {
  if (!categories.length) return null

  const anchorY = window.scrollY + NAV_OFFSET_PX + 24
  const sectionTops = categories
    .map((cat) => {
      const el = document.getElementById(cat.id)
      if (!el) return null
      return { id: cat.id, top: el.getBoundingClientRect().top + window.scrollY }
    })
    .filter((s): s is { id: CategoryId; top: number } => s !== null)

  if (!sectionTops.length) return null

  let active = sectionTops[0].id
  for (const { id, top } of sectionTops) {
    if (top <= anchorY) active = id
  }

  const nearBottom =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 80
  if (nearBottom) {
    active = sectionTops[sectionTops.length - 1].id
  }

  return active
}

function ProductDescriptionClamp({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)
  const [overflowsTwoLines, setOverflowsTwoLines] = useState<boolean | null>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = descRef.current
    if (!el) {
      setOverflowsTwoLines(false)
      return
    }

    function measure() {
      const node = descRef.current
      if (!node) return
      if (expanded) return
      setOverflowsTwoLines(node.scrollHeight > node.clientHeight + 1)
    }

    measure()
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [description, expanded])

  const showFade = !expanded && overflowsTwoLines === true
  const showToggle = expanded || overflowsTwoLines === true

  return (
    <div className="relative">
      <p
        ref={descRef}
        className={cn(
          'text-sm leading-relaxed text-secondary transition-[max-height] duration-500 ease-out motion-reduce:transition-none md:text-base',
          expanded
            ? 'line-clamp-none max-h-[min(120rem,300vh)]'
            : 'line-clamp-2 max-h-[2lh] overflow-hidden',
        )}
      >
        {description}
      </p>

      {showFade && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background via-background/80 to-transparent"
          aria-hidden
        />
      )}

      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="relative z-10 mt-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-600 hover:underline"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

function ProductShowcaseRow({
  imageFirst,
  badges,
  title,
  model,
  bullets,
  specs,
  accessories,
  description,
  cta,
  imageSrc,
  imageAlt,
  objectPosition,
}: {
  imageFirst: boolean
  badges?: string[]
  title: string
  model?: string
  bullets?: string[]
  specs?: { label: string; value: string }[]
  accessories?: string[]
  description?: string
  cta?: string
  imageSrc: string
  imageAlt: string
  objectPosition: 'left center' | 'right center' | 'center'
}) {
  const [specsOpen, setSpecsOpen] = useState(true)
  const [accessoriesOpen, setAccessoriesOpen] = useState(true)

  const textBlock = (
    <div className="flex flex-col justify-center gap-4 py-2 lg:min-h-[280px] lg:py-6">
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm font-medium text-primary">
          {badges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      )}
      <h3 className="font-heading text-2xl font-bold tracking-tight text-secondary md:text-3xl">
        {model ?? title}
      </h3>

      {description && <ProductDescriptionClamp description={description} />}
      {specs && specs.length > 0 && (
        <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
          <div className="overflow-hidden rounded-xl border border-border">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
              <h3 className="font-heading text-lg font-semibold text-secondary">Specifications</h3>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-secondary transition-transform duration-200',
                  specsOpen && 'rotate-180',
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent forceMount className="overflow-hidden">
              <div
                className={cn(
                  'transition-all duration-300 ease-out',
                  specsOpen ? 'max-h-[5000px] pb-0 opacity-100' : 'max-h-0 pb-0 opacity-0',
                )}
              >
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((spec) => (
                      <tr
                        key={`${spec.label}-${spec.value}`}
                        className="border-t border-border last:border-b-0"
                      >
                        <th className="w-2/5 bg-muted/40 px-4 py-2 text-left font-medium text-secondary">
                          {spec.label}
                        </th>
                        <td className="px-4 py-2 text-secondary">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
      {(!specs || specs.length === 0) && bullets && bullets.length > 0 && (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary md:text-base">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {accessories && accessories.length > 0 && (
        <Collapsible open={accessoriesOpen} onOpenChange={setAccessoriesOpen}>
          <div className="overflow-hidden rounded-xl border border-border">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left">
              <h3 className="font-heading text-lg font-semibold text-secondary">Accessories</h3>
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 text-secondary transition-transform duration-200',
                  accessoriesOpen && 'rotate-180',
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent forceMount className="overflow-hidden">
              <div
                className={cn(
                  'px-4 transition-all duration-300 ease-out',
                  accessoriesOpen ? 'max-h-80 pb-3 opacity-100' : 'max-h-0 pb-0 opacity-0',
                )}
              >
                <ul className="list-disc space-y-2 pl-5 text-xs leading-relaxed text-secondary md:text-sm">
                  {accessories.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
      {cta && (
        <Button
          asChild
          className="mt-2 w-fit rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary-600"
        >
          <Link href="/support">Get a quote</Link>
        </Button>
      )}
    </div>
  )

  const isSvg = imageSrc.endsWith('.svg')

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className={cn(
          'object-contain',
          objectPosition === 'left center' && 'object-left',
          objectPosition === 'right center' && 'object-right',
          objectPosition === 'center' && 'object-center',
        )}
        sizes="(min-width: 1024px) 50vw, 100vw"
        unoptimized={isSvg}
      />
    </div>
  )

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className={cn(imageFirst ? 'lg:order-1' : 'lg:order-2')}>{imageBlock}</div>
      <div className={cn(imageFirst ? 'lg:order-2' : 'lg:order-1')}>{textBlock}</div>
    </div>
  )
}

export function ProductsCatalog() {
  const { categories: cmsCategories } = useCmsCategories()
  const { products: cmsProducts } = useCmsProducts()
  const categoriesForCatalog: CategoryForCatalog[] = useMemo(
    () => {
      if (cmsCategories.length === 0) return []

      return cmsCategories
        .map((cmsCat) => {
          const cmsProductsInCategory = cmsProducts
            .filter((p) => p.categorySlug === cmsCat.id)
            .map(
              (p): ProductWithSpecs => ({
                title: p.title,
                model: p.model,
                description: p.description,
                cta: 'Learn More',
                imageSrc: p.imageSrc ?? '/images/products.png',
                imageAlt: p.imageAlt ?? p.title,
                objectPosition: 'center',
                specs: p.specs,
                accessories: p.accessories,
              }),
            )

          return {
            id: cmsCat.id,
            title: cmsCat.title,
            navLabel: cmsCat.title,
            products: cmsProductsInCategory,
          }
        })
        .filter((cat) => cat.products.length > 0)
    },
    [cmsCategories, cmsProducts],
  )

  const [activeId, setActiveId] = useState<CategoryId>(
    () => categoriesForCatalog[0]?.id ?? '',
  )

  useEffect(() => {
    if (!categoriesForCatalog.length) return
    if (!activeId || !categoriesForCatalog.some((c) => c.id === activeId)) {
      setActiveId(categoriesForCatalog[0].id)
    }
  }, [categoriesForCatalog, activeId])

  useEffect(() => {
    if (!categoriesForCatalog.length) return

    let rafId = 0
    const updateActive = () => {
      const id = getActiveCategoryId(categoriesForCatalog)
      if (id) setActiveId(id)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActive)
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [categoriesForCatalog])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && categoriesForCatalog.some((c) => c.id === hash)) {
      const id = hash as CategoryId
      requestAnimationFrame(() => scrollToSection(id))
    }
  }, [categoriesForCatalog])

  return (
    <>
      <nav
        aria-label="Product categories"
        className="sticky top-20 z-40 border-b border-border bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-3 [&::-webkit-scrollbar]:hidden">
            {categoriesForCatalog.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveId(cat.id)
                  scrollToSection(cat.id)
                }}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors md:px-6 md:py-2.5 md:text-base',
                  activeId === cat.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-transparent bg-muted/60 text-secondary hover:border-primary/30 hover:bg-muted',
                )}
              >
                {cat.navLabel}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-24 pt-10 lg:px-8 lg:pb-32 lg:pt-14">
        {categoriesForCatalog.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-[140px] mt-10 pt-10">
            <div className="mb-4 border-b border-border pb-4 lg:mb-8 lg:pb-4">
              <h2 className="font-heading text-4xl font-heavy text-primary md:text-5xl">
                {cat.title}
              </h2>
            </div>

            <div className="flex flex-col gap-16 lg:gap-24">
              {cat.products.map((product, index) => (
                <ProductShowcaseRow
                  key={`${cat.id}-${product.title}-${index}`}
                  imageFirst={index % 2 === 0}
                  badges={product.badges}
                  title={product.title}
                  model={product.model}
                  bullets={product.bullets}
                  specs={product.specs}
                  accessories={product.accessories}
                  description={product.description}
                  cta={product.cta}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt}
                  objectPosition={product.objectPosition}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
