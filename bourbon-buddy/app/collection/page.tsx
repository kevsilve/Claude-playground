import Link from 'next/link'
import prisma from '@/lib/db'
import { CollectionGrid } from '@/components/collection/CollectionGrid'
import { Button } from '@/components/ui/button'
import type { CollectionEntryWithBottle } from '@/lib/types'

export default async function CollectionPage() {
  const entries = await prisma.collectionEntry.findMany({
    include: { bottle: true },
    orderBy: { addedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">My Collection</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{entries.length} bottle{entries.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/scanner">
          <Button>+ Scan Bottle</Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-5xl">🥃</div>
          <p className="text-zinc-400">Your collection is empty.</p>
          <Link href="/scanner">
            <Button>Scan Your First Bottle</Button>
          </Link>
        </div>
      ) : (
        <CollectionGrid entries={entries as CollectionEntryWithBottle[]} />
      )}
    </div>
  )
}
