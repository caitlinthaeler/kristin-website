'use client'

import type { Project } from '@/types'
import { th, td, rowBtn } from '../../components/adminStyles'

interface Props {
  items: Project[]
  onEdit: (item: Project) => void
  onDelete: (id: number) => void
  onSections: (item: Project) => void
}

export default function ProjectsTable({ items, onEdit, onDelete, onSections }: Props) {
  if (items.length === 0) return <p className="text-muted text-sm">No projects yet.</p>

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted text-left">
            <th className={th}>Title</th>
            <th className={th}>Order</th>
            <th className={th}>Hidden</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-surface transition-colors ${item.hidden ? 'opacity-50' : ''}`}>
              <td className={td}>
                <p className="font-medium text-foreground">{item.title}</p>
                {item.description && <p className="text-xs text-muted truncate max-w-xs">{item.description}</p>}
              </td>
              <td className={td}>{item.sort_order}</td>
              <td className={td}>
                <span className={item.hidden ? 'text-primary text-xs' : 'text-muted text-xs'}>{item.hidden ? 'Yes' : 'No'}</span>
              </td>
              <td className={`${td} text-right`}>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onSections(item)} className={rowBtn}>Sections</button>
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
