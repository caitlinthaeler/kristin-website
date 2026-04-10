'use client'

import type { Service } from '@/types'
import { rowBtn } from '../../components/adminStyles'

interface Props {
  items: Service[]
  onEdit: (item: Service) => void
  onDelete: (id: number) => void
}

export default function ServicesList({ items, onEdit, onDelete }: Props) {
  if (items.length === 0) return <p className="text-muted text-sm">No services yet. Add your first offering.</p>

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl border border-border p-5 bg-surface transition-opacity ${item.hidden ? 'opacity-50' : ''}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                {item.hidden && <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-muted">hidden</span>}
              </div>
              {item.price_info && <p className="text-xs text-primary font-medium mb-1">{item.price_info}</p>}
              {item.description && <p className="text-sm text-muted line-clamp-2">{item.description}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEdit(item)} className={rowBtn}>Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-destructive hover:text-destructive/70 text-xs transition-colors">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
