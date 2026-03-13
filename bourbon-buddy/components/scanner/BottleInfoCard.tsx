'use client'

import React from 'react'
import type { BottleData } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BottleInfoCardProps {
  data: BottleData
  onAddToCollection?: () => void
}

const confidenceColor: Record<string, string> = {
  high: 'text-green-400',
  medium: 'text-amber-400',
  low: 'text-red-400',
}

export function BottleInfoCard({ data, onAddToCollection }: BottleInfoCardProps) {
  if (data.error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-zinc-400 text-center">{data.error}</p>
          <p className="text-zinc-500 text-sm text-center mt-1">
            Try a clearer photo showing the label.
          </p>
        </CardContent>
      </Card>
    )
  }

  const flavorNotes: string[] =
    typeof data.flavorNotes === 'string'
      ? JSON.parse(data.flavorNotes)
      : (data.flavorNotes ?? [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{data.name}</CardTitle>
            <p className="text-amber-400 mt-0.5">{data.distillery}</p>
          </div>
          {data.confidence && (
            <span className={`text-xs font-medium ${confidenceColor[data.confidence]}`}>
              {data.confidence} confidence
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.type && (
            <Stat label="Type" value={data.type} />
          )}
          {data.age && (
            <Stat label="Age" value={data.age} />
          )}
          {data.proof && (
            <Stat label="Proof" value={`${data.proof}`} />
          )}
          {data.region && (
            <Stat label="Region" value={data.region} />
          )}
          {data.priceRange && (
            <Stat label="Price" value={data.priceRange} />
          )}
          {data.mashBill && (
            <Stat label="Mash Bill" value={data.mashBill} />
          )}
        </div>

        {data.description && (
          <p className="text-sm text-zinc-300 leading-relaxed border-t border-zinc-800 pt-4">
            {data.description}
          </p>
        )}

        {flavorNotes.length > 0 && (
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              Tasting Notes
            </p>
            <div className="flex flex-wrap gap-2">
              {flavorNotes.map((note) => (
                <Badge key={note}>{note}</Badge>
              ))}
            </div>
          </div>
        )}

        {onAddToCollection && (
          <div className="border-t border-zinc-800 pt-4">
            <Button className="w-full" onClick={onAddToCollection}>
              Add to My Collection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-800/50 px-3 py-2">
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  )
}
