'use client'

import React, { useState } from 'react'
import type { CollectionEntryWithBottle } from '@/lib/types'
import { BottleCard } from './BottleCard'
import { Input } from '@/components/ui/input'

interface CollectionGridProps {
  entries: CollectionEntryWithBottle[]
}

const TABS = ['all', 'sealed', 'open', 'wishlist', 'empty'] as const

export function CollectionGrid({ entries }: CollectionGridProps) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = entries.filter((e) => {
    const matchesTab = activeTab === 'all' || e.status === activeTab
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      e.bottle.name.toLowerCase().includes(q) ||
      e.bottle.distillery.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {tab}
              <span className="ml-1.5 text-xs opacity-70">
                ({tab === 'all' ? entries.length : entries.filter((e) => e.status === tab).length})
              </span>
            </button>
          ))}
        </div>
        <div className="sm:ml-auto w-full sm:w-64">
          <Input
            placeholder="Search bottles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <div className="text-4xl mb-3">🥃</div>
          <p>No bottles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((entry) => (
            <BottleCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
