'use client'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
  size?: 'md' | 'lg'
}

export default function Modal({ title, onClose, children, size = 'lg' }: Props) {
  const maxW = size === 'md' ? 'max-w-md' : 'max-w-lg'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/55" />
      <div
        className={`relative bg-surface rounded-xl border border-border w-full ${maxW} max-h-[90vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-lg leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
