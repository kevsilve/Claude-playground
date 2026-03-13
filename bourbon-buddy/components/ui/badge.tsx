import * as React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sealed' | 'open' | 'empty' | 'wishlist'
}

const variantClasses: Record<string, string> = {
  default: 'bg-amber-900/40 text-amber-200 border border-amber-700/50',
  sealed: 'bg-green-900/40 text-green-300 border border-green-700/50',
  open: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  empty: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  wishlist: 'bg-purple-900/40 text-purple-300 border border-purple-700/50',
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
