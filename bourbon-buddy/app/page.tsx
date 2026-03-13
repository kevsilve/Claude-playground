import Link from 'next/link'
import prisma from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getStats() {
  const [total, open, wishlist, recent] = await Promise.all([
    prisma.collectionEntry.count(),
    prisma.collectionEntry.count({ where: { status: 'open' } }),
    prisma.collectionEntry.count({ where: { status: 'wishlist' } }),
    prisma.collectionEntry.findMany({
      take: 5,
      orderBy: { addedAt: 'desc' },
      include: { bottle: true },
    }),
  ])
  return { total, open, wishlist, recent }
}

export default async function HomePage() {
  const { total, open, wishlist, recent } = await getStats()

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 py-6">
        <div className="text-6xl">🥃</div>
        <h1 className="text-3xl font-bold text-zinc-100">Bourbon Buddy</h1>
        <p className="text-zinc-400 max-w-sm mx-auto">
          Scan any bottle, build your collection, track every pour.
        </p>
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard value={total} label="In Collection" />
          <StatCard value={open} label="Bottles Open" />
          <StatCard value={wishlist} label="On Wishlist" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/scanner">
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-amber-700/60 hover:bg-zinc-800/80 transition-all cursor-pointer space-y-2">
            <div className="text-3xl">📷</div>
            <h2 className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
              Scan a Bottle
            </h2>
            <p className="text-sm text-zinc-400">
              Take a photo or upload an image — Claude will identify the bourbon and show you everything about it.
            </p>
          </div>
        </Link>
        <Link href="/collection">
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-amber-700/60 hover:bg-zinc-800/80 transition-all cursor-pointer space-y-2">
            <div className="text-3xl">📦</div>
            <h2 className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
              My Collection
            </h2>
            <p className="text-sm text-zinc-400">
              Browse your bottles, track pour levels, ratings, and manage your wishlist.
            </p>
          </div>
        </Link>
      </div>

      {/* Recently Added */}
      {recent.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            Recently Added
          </h2>
          <div className="space-y-2">
            {recent.map((entry) => (
              <Link key={entry.id} href={`/bottle/${entry.id}`}>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-amber-700/40 transition-colors">
                  <div>
                    <p className="font-medium text-zinc-200 text-sm">{entry.bottle.name}</p>
                    <p className="text-xs text-zinc-500">{entry.bottle.distillery}</p>
                  </div>
                  <Badge variant={(entry.status as 'sealed' | 'open' | 'empty' | 'wishlist' | 'default') ?? 'default'}>{entry.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="text-center text-zinc-600 py-4">
          <p className="text-sm">Your collection is empty — scan your first bottle to get started!</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4 text-center">
        <p className="text-2xl font-bold text-amber-400">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      </CardContent>
    </Card>
  )
}
