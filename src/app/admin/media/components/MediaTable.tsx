'use client'

import type { Media } from '@/types'
import Toggle from '../../components/Toggle'
import { th, td, rowBtn } from '../../components/adminStyles'

interface Props {
  items: Media[]
  onEdit: (item: Media) => void
  onDelete: (id: number) => void
  onToggle: (item: Media, field: 'hidden' | 'archived') => void
}

export default function MediaTable({ items, onEdit, onDelete, onToggle }: Props) {
  if (items.length === 0) return <p className="text-muted text-sm">No items.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted text-left">
            <th className={th}>Filename</th>
            <th className={th}>Title</th>
            <th className={th}>Type</th>
            <th className={th}>Order</th>
            <th className={th}>Hidden</th>
            <th className={th}>Archived</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className={`border-b border-border last:border-0 hover:bg-surface transition-colors ${item.archived ? 'opacity-40' : item.hidden ? 'opacity-60' : ''}`}
            >
              <td className={td}>
                <span className="font-mono text-xs text-muted max-w-[200px] block truncate">{item.filename}</span>
              </td>
              <td className={td}>{item.title ?? <span className="text-muted italic">—</span>}</td>
              <td className={td}>
                <span className="px-2 py-0.5 rounded-full bg-surface-elevated text-xs">{item.type}</span>
              </td>
              <td className={td}>{item.sort_order}</td>
              <td className={td}><Toggle checked={item.hidden} onChange={() => onToggle(item, 'hidden')} /></td>
              <td className={td}><Toggle checked={item.archived} onChange={() => onToggle(item, 'archived')} /></td>
              <td className={`${td} text-right`}>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(item)} className={rowBtn}>Edit</button>
                  <button onClick={() => onDelete(item.id)} className="text-destructive hover:text-destructive/70 text-xs transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
