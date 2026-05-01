'use client'

import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { productCategories } from '@/lib/products-catalog-data'
import { ProductsMegaMenuContent } from '@/components/products-mega-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Partners', href: '/partners' },
  { label: 'Support', href: '/support' },
]

const MENU_CLOSE_DELAY_MS = 180

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsMenuOpen, setProductsMenuOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const closeProductsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearProductsCloseTimer = useCallback(() => {
    if (closeProductsTimerRef.current) {
      clearTimeout(closeProductsTimerRef.current)
      closeProductsTimerRef.current = null
    }
  }, [])

  const openProductsMenu = useCallback(() => {
    clearProductsCloseTimer()
    setProductsMenuOpen(true)
  }, [clearProductsCloseTimer])

  const scheduleCloseProductsMenu = useCallback(() => {
    clearProductsCloseTimer()
    closeProductsTimerRef.current = setTimeout(() => {
      setProductsMenuOpen(false)
      closeProductsTimerRef.current = null
    }, MENU_CLOSE_DELAY_MS)
  }, [clearProductsCloseTimer])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <Image
                src="/images/glacier_fresh_logo.png"
                alt="Glacier Fresh"
                width={200}
                height={100}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 self-stretch md:flex" aria-label="Main">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            <div
              className="flex items-center self-stretch"
              onMouseEnter={openProductsMenu}
              onMouseLeave={scheduleCloseProductsMenu}
            >
              <Link
                href="/products"
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                  productsMenuOpen ? 'text-primary' : 'text-secondary',
                )}
                aria-haspopup="true"
                aria-expanded={productsMenuOpen}
              >
                Products
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 transition-transform duration-200',
                    productsMenuOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </Link>
            </div>

            {navItems.slice(2).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Where to buy?
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary-600">
              {"Let's Talk"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Products mega menu — full width below bar */}
        <AnimatePresence>
          {productsMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full z-40 hidden border-t border-border bg-background shadow-lg md:block"
              onMouseEnter={openProductsMenu}
              onMouseLeave={scheduleCloseProductsMenu}
            >
              <ProductsMegaMenuContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-6" aria-label="Mobile">
              <Link
                href="/"
                className="py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/our-story"
                className="py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Story
              </Link>

              <Collapsible open={mobileProductsOpen} onOpenChange={setMobileProductsOpen}>
                <div className="flex items-center justify-between py-2">
                  <Link
                    href="/products"
                    className="text-sm font-medium text-secondary transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <CollapsibleTrigger
                    className="flex h-9 w-9 items-center justify-center rounded-md text-secondary hover:bg-muted hover:text-primary"
                    aria-label={mobileProductsOpen ? 'Collapse products' : 'Expand products'}
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform',
                        mobileProductsOpen && 'rotate-180',
                      )}
                    />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-4 pb-2 pl-2">
                  {productCategories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        href={`/products#${cat.id}`}
                        className="font-heading text-sm font-semibold text-primary"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setMobileProductsOpen(false)
                        }}
                      >
                        {cat.title}
                      </Link>
                      <ul className="mt-2 space-y-2 border-l border-border pl-3">
                        {cat.products.map((p) => (
                          <li key={p.title}>
                            <Link
                              href={`/products#${cat.id}`}
                              className="text-sm text-muted-foreground hover:text-primary"
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setMobileProductsOpen(false)
                              }}
                            >
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Link
                href="/partners"
                className="py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Partners
              </Link>
              <Link
                href="/support"
                className="py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Where to buy?
                </Button>
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary-600">
                  {"Let's Talk"}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
