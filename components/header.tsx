'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Products', href: '/products' },
  { label: 'Partners', href: '/partners' },
  { label: 'Support', href: '/support' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
           <Image src="/images/glacier_fresh_logo.png" alt="Glacier Fresh" width={200} height={100} />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-secondary transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
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
