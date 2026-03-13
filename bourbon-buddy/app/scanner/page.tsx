'use client'

import React, { useState } from 'react'
import type { BottleData } from '@/lib/types'
import { ImageCapture } from '@/components/scanner/ImageCapture'
import { BottleInfoCard } from '@/components/scanner/BottleInfoCard'
import { AddToCollectionModal } from '@/components/collection/AddToCollectionModal'
import { Button } from '@/components/ui/button'

type ScanState = 'idle' | 'scanning' | 'done' | 'error'

export default function ScannerPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [result, setResult] = useState<BottleData | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)

  const [pendingImage, setPendingImage] = useState<{
    base64: string
    mimeType: string
  } | null>(null)

  const handleImageSelected = (base64: string, mimeType: string, imagePreview: string) => {
    setPreview(imagePreview)
    setPendingImage({ base64, mimeType })
    setResult(null)
    setScanState('idle')
    setAddSuccess(false)
  }

  const handleScan = async () => {
    if (!pendingImage) return
    setScanState('scanning')
    setResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: pendingImage.base64, mimeType: pendingImage.mimeType }),
      })
      const data = await res.json()
      setResult(data)
      setScanState('done')
    } catch {
      setScanState('error')
    }
  }

  const handleReset = () => {
    setPreview(null)
    setPendingImage(null)
    setResult(null)
    setScanState('idle')
    setAddSuccess(false)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Bottle Scanner</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Photograph a bottle or its barcode — Claude will identify it instantly.
        </p>
      </div>

      {!preview ? (
        <ImageCapture onImageSelected={handleImageSelected} disabled={scanState === 'scanning'} />
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Bottle preview" className="w-full max-h-72 object-contain bg-zinc-900" />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 rounded-full bg-zinc-900/80 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700"
            >
              Change
            </button>
          </div>

          {scanState === 'idle' && (
            <Button className="w-full" size="lg" onClick={handleScan}>
              Identify Bottle
            </Button>
          )}

          {scanState === 'scanning' && (
            <div className="flex items-center justify-center gap-3 py-6">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-400 text-sm">Analyzing bottle with Claude...</span>
            </div>
          )}

          {scanState === 'error' && (
            <div className="rounded-lg bg-red-900/20 border border-red-800/50 p-4 text-sm text-red-400">
              Something went wrong. Please try again.
              <button className="underline ml-2" onClick={handleScan}>Retry</button>
            </div>
          )}

          {scanState === 'done' && result && (
            <>
              {addSuccess && (
                <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-3 text-sm text-green-400">
                  Added to your collection!
                </div>
              )}
              <BottleInfoCard
                data={result}
                onAddToCollection={result.error ? undefined : () => setShowAddModal(true)}
              />
              <Button variant="outline" className="w-full" onClick={handleReset}>
                Scan Another Bottle
              </Button>
            </>
          )}
        </div>
      )}

      {result && !result.error && (
        <AddToCollectionModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          bottleData={result}
          onSuccess={() => setAddSuccess(true)}
        />
      )}
    </div>
  )
}
