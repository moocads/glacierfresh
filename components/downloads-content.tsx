import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { DownloadDocument } from '@/lib/cms-documents'

type DownloadsContentProps = {
  documents: DownloadDocument[]
}

export function DownloadsContent({ documents }: DownloadsContentProps) {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h1 className="type-page-heading text-secondary">Downloads</h1>
          <p className="type-body mt-5 text-muted-foreground">
            Find product catalogues, brochures, and technical resources for sales, installation,
            and after-sales service.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="sr-only">Documents</h2>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {documents.map((document) => (
              <li key={document.id} className="list-none">
                <article
                  className={cn(
                    'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
                    'shadow-sm transition-[box-shadow,border-color] duration-300',
                    'hover:border-primary/25 hover:shadow-md',
                  )}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <Image
                      src={document.coverImageUrl}
                      alt={document.coverImageAlt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-secondary">
                        {document.title}
                      </h3>
                      <p className="type-supporting mt-1.5 text-muted-foreground">
                        {document.shortDescription}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-auto w-full rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <a
                        href={document.pdfUrl}
                        download={document.pdfFileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        <Download className="size-4 shrink-0" aria-hidden />
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
