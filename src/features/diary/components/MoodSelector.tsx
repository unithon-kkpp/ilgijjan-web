import type { Mood } from '../types/diary.types'

interface MoodSelectorProps {
  value: Mood | null
  onChange: (mood: Mood) => void
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const options: Mood[] = ['HAPPY', 'SOSO', 'SAD', 'ANGRY', 'EXCITED']
  return (
    <div>
      {options.map((m) => (
        <button key={m} onClick={() => onChange(m)} aria-pressed={value === m}>
          {m}
        </button>
      ))}
    </div>
  )
}
