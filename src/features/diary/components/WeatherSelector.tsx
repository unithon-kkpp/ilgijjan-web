import type { Weather } from '../types/diary.types'

interface WeatherSelectorProps {
  value: Weather | null
  onChange: (weather: Weather) => void
}

export default function WeatherSelector({ value, onChange }: WeatherSelectorProps) {
  const options: Weather[] = ['SUNNY', 'CLOUDY', 'RAINY', 'SNOWY', 'WINDY']
  return (
    <div>
      {options.map((w) => (
        <button key={w} onClick={() => onChange(w)} aria-pressed={value === w}>
          {w}
        </button>
      ))}
    </div>
  )
}
