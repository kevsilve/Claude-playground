import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const entries = await prisma.collectionEntry.findMany({
      where: status ? { status } : undefined,
      include: { bottle: true },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Collection GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bottleData, status, pourLevel, rating, notes, purchasePrice, purchaseDate } = body

    // Find existing bottle or create new one
    let bottle = await prisma.bottle.findFirst({
      where: {
        name: bottleData.name,
        distillery: bottleData.distillery,
      },
    })

    if (!bottle) {
      bottle = await prisma.bottle.create({
        data: {
          name: bottleData.name,
          distillery: bottleData.distillery,
          age: bottleData.age ?? null,
          proof: bottleData.proof ?? null,
          mashBill: bottleData.mashBill ?? null,
          region: bottleData.region ?? null,
          type: bottleData.type ?? null,
          flavorNotes: bottleData.flavorNotes ? JSON.stringify(bottleData.flavorNotes) : null,
          description: bottleData.description ?? null,
          priceRange: bottleData.priceRange ?? null,
        },
      })
    }

    const entry = await prisma.collectionEntry.create({
      data: {
        bottleId: bottle.id,
        status: status ?? 'sealed',
        pourLevel: pourLevel ?? 100,
        rating: rating ?? null,
        notes: notes ?? null,
        purchasePrice: purchasePrice ?? null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      },
      include: { bottle: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Collection POST error:', error)
    return NextResponse.json({ error: 'Failed to add to collection' }, { status: 500 })
  }
}
