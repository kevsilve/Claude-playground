import { NextRequest, NextResponse } from 'next/server'
import { scanBottle } from '@/lib/claude'

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType } = await req.json()

    if (!image || !mimeType) {
      return NextResponse.json({ error: 'Missing image or mimeType' }, { status: 400 })
    }

    const result = await scanBottle(image, mimeType)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Scan error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Failed to scan bottle', detail: message }, { status: 500 })
  }
}
