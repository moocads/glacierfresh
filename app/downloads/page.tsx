import type { Metadata } from 'next'
import { DownloadsContent } from '@/components/downloads-content'
import { getDownloadDocuments } from '@/lib/cms-documents'

export const metadata: Metadata = {
  title: 'Downloads | Glacier Fresh',
  description:
    'Download Glacier Fresh product catalogues, brochures, and technical resources for partners and installers.',
}

export default async function DownloadsPage() {
  const documents = await getDownloadDocuments()

  return (
    <main className="min-h-screen">
      <DownloadsContent documents={documents} />
    </main>
  )
}
