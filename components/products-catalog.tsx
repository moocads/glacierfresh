'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  productCategories,
  type ProductCategoryId,
} from '@/lib/products-catalog-data'

const NAV_OFFSET_PX = 140

type CategoryId = ProductCategoryId

function scrollToSection(id: CategoryId) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

function ProductShowcaseRow({
  imageFirst,
  badges,
  title,
  model,
  bullets,
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
  description?: string
  cta?: string
  imageSrc: string
  imageAlt: string
  objectPosition: 'left center' | 'right center' | 'center'
}) {
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
        {title}
      </h3>
      {model && <p className="text-sm text-muted-foreground">{model}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-secondary md:text-base">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {description && (
        <p className="text-sm leading-relaxed text-secondary md:text-base">{description}</p>
      )}
      {cta && (
        <Button
          asChild
          className="mt-2 w-fit rounded-full bg-primary px-8 text-primary-foreground hover:bg-primary-600"
        >
          <Link href="/support">{cta}</Link>
        </Button>
      )}
    </div>
  )

  const isSvg = imageSrc.endsWith('.svg')

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className={cn(
          'object-cover',
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
  const [activeId, setActiveId] = useState<CategoryId>(
    () => productCategories[0]?.id ?? 'whole-house',
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]
        if (visible?.target?.id) {
          const id = visible.target.id as CategoryId
          if (productCategories.some((c) => c.id === id)) setActiveId(id)
        }
      },
      {
        rootMargin: `-${NAV_OFFSET_PX}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      },
    )

    productCategories.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash && productCategories.some((c) => c.id === hash)) {
      const id = hash as CategoryId
      requestAnimationFrame(() => scrollToSection(id))
    }
  }, [])

  return (
    <>
      <nav
        aria-label="Product categories"
        className="sticky top-20 z-40 border-b border-border bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-3 [&::-webkit-scrollbar]:hidden">
            {productCategories.map((cat) => (
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
        {productCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-[140px]">
            <div className="mb-12 border-b border-border pb-6 lg:mb-16 lg:pb-8">
              <h2 className="font-heading text-3xl font-heavy text-primary md:text-4xl">
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
