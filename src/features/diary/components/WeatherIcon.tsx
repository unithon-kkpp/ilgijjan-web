import type { Weather } from '../types/diary.types'

interface WeatherIconProps {
  weather: Weather
  size?: number
  className?: string
}

const NATURAL_SIZE: Record<Weather, number> = {
  SUNNY: 110,
  CLOUDY: 117,
  RAINY: 113,
  SNOWY: 109,
}

interface LayerProps {
  src: string
  // CSS inset: "top right bottom left"
  inset?: string
}
function Layer({ src, inset = '0 0 0 0' }: LayerProps) {
  const [t, r, b, l] = inset.split(' ')
  return (
    <div
      style={{
        position: 'absolute',
        top: t,
        right: r,
        bottom: b,
        left: l,
      }}
    >
      <img
        src={src}
        alt=""
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default function WeatherIcon({ weather, size = 110, className }: WeatherIconProps) {
  // Figma 자연 사이즈 기준으로 size 만큼 스케일
  const natural = NATURAL_SIZE[weather]
  const scaled = size

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: scaled,
        height: scaled * (natural / natural), // 정사각 보존
      }}
    >
      {weather === 'SUNNY' && (
        <>
          <Layer src="/images/weather/sunny-rays.svg" />
          <Layer src="/images/weather/sunny-face.svg" inset="22.22% 22.22% 22.22% 22.22%" />
        </>
      )}
      {weather === 'CLOUDY' && (
        <>
          <Layer src="/images/weather/cloudy-sun.svg" inset="11.11% 25% 41.67% 0" />
          <Layer src="/images/weather/cloudy-face.svg" inset="30.56% 36.11% 25% 19.44%" />
          <Layer src="/images/weather/cloudy-cloud.svg" inset="36.11% 0 11.11% 2.78%" />
        </>
      )}
      {weather === 'RAINY' && (
        <>
          <Layer src="/images/weather/rainy-1.svg" inset="5.56% 41.67% 2.78% 25%" />
          <Layer src="/images/weather/rainy-2.svg" inset="11.11% 0 47.22% 8.33%" />
          <Layer src="/images/weather/rainy-3.svg" inset="11.11% 11.11% 47.22% 19.44%" />
          <Layer src="/images/weather/rainy-4.svg" inset="11.11% 30.56% 47.22% 38.89%" />
          <Layer src="/images/weather/rainy-5.svg" inset="0.25% 0 58.58% 0" />
        </>
      )}
      {weather === 'SNOWY' && (
        <>
          <Layer src="/images/weather/snowy-1.svg" inset="0 0 44.44% 0" />
          <Layer src="/images/weather/snowy-2.svg" inset="58.33% 3.95% 0 1.11%" />
        </>
      )}
    </div>
  )
}
