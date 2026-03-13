'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { CollectionEntryWithBottle } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { BottleInfoCard } from '@/components/scanner/BottleInfoCard'

type BadgeVariant = 'sealed' | 'open' | 'empty' | 'wishlist' | 'default'

const statusVariant: Record<string, BadgeVariant> = {
  sealed: 'sealed',
  open: 'open',
  empty: 'empty',
  wishlist: 'wishlist',
}

export default function BottleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [entry, setEntry] = useState<CollectionEntryWithBottle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved, setSaved] = useState(false)

  // Editable fields
  const [status, setStatus] = useState('sealed')
  const [pourLevel, setPourLevel] = useState('100')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  useEffect(() => {
    fetch(`/api/collection/${params.id}`)
      .then((r) => r.json())
      .then((data: CollectionEntryWithBottle) => {
        setEntry(data)
        setStatus(data.status)
        setPourLevel(String(data.pourLevel ?? 100))
        setRating(data.rating !== null ? String(data.rating) : '')
        setNotes(data.notes ?? '')
        setPurchasePrice(data.purchasePrice !== null ? String(data.purchasePrice) : '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/collection/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        pourLevel: parseInt(pourLevel),
        rating: rating ? parseFloat(rating) : null,
        notes: notes || null,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Remove this bottle from your collection?')) return
    setDeleting(true)
    await fetch(`/api/collection/${params.id}`, { method: 'DELETE' })
    router.push('/collection')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="text-center py-20 text-zinc-400">
        <p>Bottle not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/collection')}>
          Back to Collection
        </Button>
      </div>
    )
  }

  const bottleAsData = {
    name: entry.bottle.name,
    distillery: entry.bottle.distillery,
    age: entry.bottle.age ?? undefined,
    proof: entry.bottle.proof ?? undefined,
    mashBill: entry.bottle.mashBill ?? undefined,
    region: entry.bottle.region ?? undefined,
    type: entry.bottle.type ?? undefined,
    flavorNotes: entry.bottle.flavorNotes
      ? JSON.parse(entry.bottle.flavorNotes)
      : undefined,
    description: entry.bottle.description ?? undefined,
    priceRange: entry.bottle.priceRange ?? undefined,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/collection')}>
          ← Collection
        </Button>
        <Badge variant={statusVariant[entry.status]}>{entry.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bottle Info */}
        <BottleInfoCard data={bottleAsData} />

        {/* Collection Entry Editor */}
        <Card>
          <CardHeader>
            <CardTitle>My Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="sealed">Sealed</option>
                <option value="open">Open</option>
                <option value="empty">Empty</option>
                <option value="wishlist">Wishlist</option>
              </Select>
            </div>

            {status !== 'wishlist' && (
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">
                  Pour Level: {pourLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pourLevel}
                  onChange={(e) => setPourLevel(e.target.value)}
                  className="w-full accent-amber-500"
                />
                <div className="h-1.5 rounded-full bg-zinc-800 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${pourLevel}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Rating (0-10)</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  placeholder="e.g. 8.5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Price Paid ($)</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="45.99"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Notes</label>
              <Textarea
                placeholder="Tasting notes, where you got it, memories..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Removing...' : 'Remove from Collection'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
