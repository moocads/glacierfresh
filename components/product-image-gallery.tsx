'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ProductImageGalleryProps = {
  images: string[]
  alt: string
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const galleryImages = images.length ? images : ['/images/products.png']
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = galleryImages[activeIndex] ?? galleryImages[0]
  const hasMultipleImages = galleryImages.length > 1
  const isSvg = activeImage.endsWith('.svg')

  function goToPrevious() {
    setActiveIndex((index) =>
      index === 0 ? galleryImages.length - 1 : index - 1,
    )
  }

  function goToNext() {
    setActiveIndex((index) =>
      index === galleryImages.length - 1 ? 0 : index + 1,
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white">
        <Image
          src={activeImage}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(min-width: 1024px) 44vw, 100vw"
          unoptimized={isSvg}
          priority
        />

        {hasMultipleImages && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute left-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/90"
              onClick={goToPrevious}
              aria-label="Previous product image"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full bg-background/90"
              onClick={goToNext}
              aria-label="Next product image"
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg border bg-white transition',
                activeIndex === index
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50',
              )}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show product image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="96px"
                unoptimized={image.endsWith('.svg')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
