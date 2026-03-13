export interface BottleData {
  name: string
  distillery: string
  age?: string
  proof?: number
  mashBill?: string
  region?: string
  type?: string
  flavorNotes?: string[]
  description?: string
  priceRange?: string
  confidence?: 'high' | 'medium' | 'low'
  error?: string
}

export interface CollectionEntryWithBottle {
  id: string
  bottleId: string
  status: string
  pourLevel: number | null
  rating: number | null
  notes: string | null
  purchasePrice: number | null
  purchaseDate: Date | null
  addedAt: Date
  updatedAt: Date
  bottle: {
    id: string
    name: string
    distillery: string
    age: string | null
    proof: number | null
    mashBill: string | null
    region: string | null
    type: string | null
    flavorNotes: string | null
    description: string | null
    priceRange: string | null
    createdAt: Date
  }
}
