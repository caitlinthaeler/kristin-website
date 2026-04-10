interface Props {
  label: string
  hint?: string
  children: React.ReactNode
}

export default function Field({ label, hint, children }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
        {label}
        {hint && <span className="font-normal normal-case ml-1 text-muted/60">— {hint}</span>}
      </label>
      {children}
    </div>
  )
}
