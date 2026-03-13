'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ImageCaptureProps {
  onImageSelected: (base64: string, mimeType: string, preview: string) => void
  disabled?: boolean
}

const MAX_SIZE_BYTES = 4.5 * 1024 * 1024 // 4.5 MB to stay under 5 MB limit
const MAX_DIMENSION = 2000

function resizeImage(file: File): Promise<{ base64: string; mimeType: string; preview: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const preview = canvas.toDataURL(mimeType, 0.85)
      const base64 = preview.split(',')[1]
      resolve({ base64, mimeType, preview })
    }
    img.onerror = reject
    img.src = url
  })
}

export function ImageCapture({ onImageSelected, disabled }: ImageCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      if (file.size > MAX_SIZE_BYTES * 1.5) {
        alert('Image is too large. Please choose an image under 7MB.')
        return
      }
      const result = await resizeImage(file)
      onImageSelected(result.base64, result.mimeType, result.preview)
    },
    [onImageSelected],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s)
      setShowCamera(true)
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s
      }, 50)
    } catch {
      alert('Camera access denied. Please use file upload instead.')
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    setShowCamera(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    const preview = canvas.toDataURL('image/jpeg', 0.85)
    const base64 = preview.split(',')[1]
    stopCamera()
    onImageSelected(base64, 'image/jpeg', preview)
  }

  if (showCamera) {
    return (
      <div className="space-y-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border border-zinc-700"
        />
        <div className="flex gap-3">
          <Button onClick={capturePhoto} className="flex-1">
            Capture Photo
          </Button>
          <Button variant="outline" onClick={stopCamera}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
          dragOver
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-zinc-700 hover:border-amber-600/60 hover:bg-zinc-800/50'
        }`}
      >
        <div className="text-4xl">🥃</div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">Drop a photo here or click to upload</p>
          <p className="text-xs text-zinc-500 mt-1">JPEG, PNG, WebP · max 7 MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-zinc-800" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 border-t border-zinc-800" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={startCamera}
        disabled={disabled}
      >
        Use Camera
      </Button>
    </div>
  )
}
