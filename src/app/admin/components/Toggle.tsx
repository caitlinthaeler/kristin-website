'use client'

interface Props {
  checked: boolean
  onChange: () => void
}

export default function Toggle({ checked, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${checked ? 'bg-primary' : 'bg-surface-elevated'}`}
    >
      <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${checked ? 'left-[17px]' : 'left-0.5'}`} />
    </button>
  )
}
