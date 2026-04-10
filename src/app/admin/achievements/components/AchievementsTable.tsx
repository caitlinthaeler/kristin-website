'use client'

import type { Achievement, AchievementCategory } from '@/types'
import { td, rowBtn } from '../../components/adminStyles'

interface Props {
  items: Achievement[]
  categories: AchievementCategory[]
  onEdit: (item: Achievement) => void
  onDelete: (id: number) => void
}

export default function AchievementsTable({ items, categories, onEdit, onDelete }: Props) {
  const grouped = categories.reduce<Record<string, Achievement[]>>((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const group = grouped[cat]
        if (group.length === 0) return null
        return (
          <div key={cat}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 capitalize">{cat}</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {group.map((item) => (
                    <tr key={item.id} className={`border-b border-border last:border-0 hover:bg-surface transition-colors ${item.hidden ? 'opacity-50' : ''}`}>
                      <td className={td}>
                        <p className="font-medium text-foreground">{item.title}</p>
                        {item.subtitle && <p className="text-xs text-muted">{item.subtitle}</p>}
                      </td>
                      <td className={`${td} text-muted text-xs`}>{item.date_text}</td>
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
          </div>
        )
      })}
    </div>
  )
}
