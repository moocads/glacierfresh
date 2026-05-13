'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
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
  const [accessoriesOpen, setAccessoriesOpen] = useState(false)

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

    
      {description && (
        <p className="text-sm leading-relaxed text-secondary md:text-base">{description}</p>
      )}
      {specs && specs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {specs.map((spec) => (
                <tr key={`${spec.label}-${spec.value}`} className="border-b border-border last:border-b-0">
                  <th className="w-2/5 bg-muted/40 px-4 py-2 text-left font-medium text-secondary">
                    {spec.label}
                  </th>
                  <td className="px-4 py-2 text-secondary">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          
          <Link href="/support">Get Quote</Link> <Link href="/support">Get Quote</Link>
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]
        if (visible?.target?.id) {
          const id = visible.target.id as CategoryId
          if (categoriesForCatalog.some((c) => c.id === id)) setActiveId(id)
        }
      },
      {
        rootMargin: `-${NAV_OFFSET_PX}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    categoriesForCatalog.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
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
                onClick={() => scrollToSection(cat.id)}
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
