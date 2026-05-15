import type { Mood } from '../types/diary.types'

interface MoodIconProps {
  mood: Mood
  size?: number
  className?: string
}

// 80x80 좌표계 위에 SVG 조각을 배치 (Figma 원본 사이즈 기준)
interface LayerProps {
  src: string
  x: number
  y: number
  w: number
  h: number
}

function Layer({ src, x, y, w, h }: LayerProps) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        left: `${(x / 80) * 100}%`,
        top: `${(y / 80) * 100}%`,
        width: `${(w / 80) * 100}%`,
        height: `${(h / 80) * 100}%`,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}

// 단일 SVG 무드 (놀란/눈물/냠냠/속상/멋진)
function SingleMood({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}

export default function MoodIcon({ mood, size = 80, className }: MoodIconProps) {
  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size }}
    >
      {mood === 1 && (
        // 미소 - 노란 원 + 양 눈 + 입
        <>
          <SingleMood src="/images/mood/base-circle.svg" />
          {/* 양 눈: 자연 viewBox 28.1335 x 40.7508, bbox 26.134x38.751 at x=15,y=14 */}
          <Layer src="/images/mood/mood1-eye-l.svg" x={14} y={13} w={28.134} h={40.751} />
          <Layer src="/images/mood/mood1-eye-r.svg" x={37.37} y={13} w={28.134} h={40.751} />
          {/* 입: bbox at x=29.22 y=59.72 w=20.52 h=5.88, 확장 -34% -9.77% */}
          <Layer src="/images/mood/mood1-mouth.svg" x={27.22} y={57.72} w={24.52} h={9.88} />
        </>
      )}
      {mood === 2 && <SingleMood src="/images/mood/mood2-nollan.svg" />}
      {mood === 3 && <SingleMood src="/images/mood/mood3-nunmul.svg" />}
      {mood === 4 && <SingleMood src="/images/mood/mood4-nyamnyam.svg" />}
      {mood === 5 && <SingleMood src="/images/mood/mood5-sokssang.svg" />}
      {mood === 6 && (
        // 하트
        <>
          <SingleMood src="/images/mood/base-circle.svg" />
          {/* 오른쪽 하트눈 */}
          <Layer src="/images/mood/mood6-union-r.svg" x={39.37} y={12} w={28.134} h={40.751} />
          <Layer src="/images/mood/mood6-heart.svg" x={42} y={21} w={21} h={21} />
          <Layer src="/images/mood/mood6-ellipse21.svg" x={44} y={28} w={5} h={5} />
          <Layer src="/images/mood/mood6-star.svg" x={49} y={33} w={2.967} h={4.485} />
          {/* 왼쪽 하트눈 */}
          <Layer src="/images/mood/mood6-union-l.svg" x={14} y={12} w={28.134} h={40.751} />
          <Layer src="/images/mood/mood6-heart.svg" x={16.63} y={21} w={21} h={21} />
          <Layer src="/images/mood/mood6-ellipse21.svg" x={19} y={28} w={5} h={5} />
          <Layer src="/images/mood/mood6-star.svg" x={23.63} y={33} w={2.967} h={4.485} />
        </>
      )}
      {mood === 7 && <SingleMood src="/images/mood/mood7-meotjin.svg" />}
      {mood === 8 && (
        // 웃는
        <>
          <SingleMood src="/images/mood/base-circle.svg" />
          <Layer src="/images/mood/mood8-eye-l.svg" x={14} y={13} w={28.134} h={40.751} />
          <Layer src="/images/mood/mood8-eye-r.svg" x={37.37} y={13} w={28.134} h={40.751} />
          {/* 입 부분 */}
          <Layer src="/images/mood/mood8-mouth-1.svg" x={29.5} y={58} w={20} h={6.5} />
          <Layer src="/images/mood/mood8-mouth-2.svg" x={26} y={56} w={26} h={11.5} />
        </>
      )}
      {mood === 9 && (
        // 엥
        <>
          <SingleMood src="/images/mood/base-circle.svg" />
          {/* 양 볼 (cheek) */}
          <Layer src="/images/mood/mood9-cheek.svg" x={6} y={42} w={23} h={23} />
          <Layer src="/images/mood/mood9-cheek.svg" x={50} y={42} w={23} h={23} />
          {/* 눈 */}
          <Layer src="/images/mood/mood9-eye-l.svg" x={14} y={13} w={28.134} h={40.751} />
          <Layer src="/images/mood/mood9-eye-r.svg" x={37.37} y={13} w={28.134} h={40.751} />
          {/* 눈썹 + 입 */}
          <Layer src="/images/mood/mood9-brow-l.svg" x={16} y={7} w={15.2} h={11.9} />
          <Layer src="/images/mood/mood9-brow-r.svg" x={49} y={7} w={14.2} h={13.5} />
          <Layer src="/images/mood/mood9-mouth-1.svg" x={29.5} y={57.5} w={21.7} h={6} />
          <Layer src="/images/mood/mood9-mouth-2.svg" x={31.25} y={58.79} w={17} h={3} />
        </>
      )}
    </div>
  )
}
