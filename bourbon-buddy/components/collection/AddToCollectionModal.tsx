'use client'

import React, { useState } from 'react'
import type { BottleData } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface AddToCollectionModalProps {
  open: boolean
  onClose: () => void
  bottleData: BottleData
  onSuccess?: () => void
}

export function AddToCollectionModal({
  open,
  onClose,
  bottleData,
  onSuccess,
}: AddToCollectionModalProps) {
  const [status, setStatus] = useState('sealed')
  const [pourLevel, setPourLevel] = useState('100')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bottleData,
          status,
          pourLevel: parseInt(pourLevel),
          rating: rating ? parseFloat(rating) : null,
          notes: notes || null,
          purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || data.error || `HTTP ${res.status}`)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to collection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <p className="text-sm text-zinc-400 mt-1">{bottleData.name}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Status</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="sealed">Sealed</option>
              <option value="open">Open</option>
              <option value="wishlist">Wishlist</option>
              <option value="empty">Empty</option>
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
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">
                Rating (0-10)
              </label>
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
              <label className="text-xs font-medium text-zinc-400 block mb-1">
                Purchase Price ($)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 45.99"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Notes</label>
            <Textarea
              placeholder="Your tasting notes, memories, where you got it..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? 'Adding...' : 'Add to Collection'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
