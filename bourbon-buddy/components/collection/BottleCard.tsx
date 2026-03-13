'use client'

import React from 'react'
import Link from 'next/link'
import type { CollectionEntryWithBottle } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BottleCardProps {
  entry: CollectionEntryWithBottle
}

const statusVariant: Record<string, 'sealed' | 'open' | 'empty' | 'wishlist'> = {
  sealed: 'sealed',
  open: 'open',
  empty: 'empty',
  wishlist: 'wishlist',
}

function StarRating({ rating }: { rating: number }) {
  const stars = Math.round(rating / 2) // convert 0-10 to 0-5
  return (
    <span className="text-amber-400 text-xs">
      {'★'.repeat(stars)}
      {'☆'.repeat(5 - stars)}
    </span>
  )
}

export function BottleCard({ entry }: BottleCardProps) {
  const { bottle } = entry

  return (
    <Link href={`/bottle/${entry.id}`}>
      <Card className="h-full hover:border-amber-700/50 transition-colors cursor-pointer">
        <CardContent className="pt-5 pb-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-zinc-100 truncate">{bottle.name}</p>
              <p className="text-sm text-amber-400/80 truncate">{bottle.distillery}</p>
            </div>
            <Badge variant={statusVariant[entry.status] ?? 'default'} className="shrink-0">
              {entry.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
            {bottle.type && <span>{bottle.type}</span>}
            {bottle.age && <span>· {bottle.age}</span>}
            {bottle.proof && <span>· {bottle.proof} proof</span>}
          </div>

          {entry.status !== 'wishlist' && entry.pourLevel !== null && (
            <div>
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>Pour Level</span>
                <span>{entry.pourLevel}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div
                  className="h-1.5 rounded-full bg-amber-500 transition-all"
                  style={{ width: `${entry.pourLevel}%` }}
                />
              </div>
            </div>
          )}

          {entry.rating !== null && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={entry.rating} />
              <span className="text-xs text-zinc-500">{entry.rating}/10</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
