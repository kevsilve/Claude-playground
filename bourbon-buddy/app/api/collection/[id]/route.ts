import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const entry = await prisma.collectionEntry.findUnique({
      where: { id: params.id },
      include: { bottle: true },
    })
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(entry)
  } catch (error) {
    console.error('Collection GET[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status, pourLevel, rating, notes, purchasePrice, purchaseDate } = body

    const entry = await prisma.collectionEntry.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(pourLevel !== undefined && { pourLevel }),
        ...(rating !== undefined && { rating }),
        ...(notes !== undefined && { notes }),
        ...(purchasePrice !== undefined && { purchasePrice }),
        ...(purchaseDate !== undefined && { purchaseDate: purchaseDate ? new Date(purchaseDate) : null }),
      },
      include: { bottle: true },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Collection PUT error:', error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.collectionEntry.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Collection DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
