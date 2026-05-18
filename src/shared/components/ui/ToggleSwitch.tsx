interface ToggleSwitchProps {
  on: boolean
  /** OFF 상태일 때의 트랙 색. 기본 회색. */
  offColor?: string
  /** ON 상태일 때의 트랙 색. 기본 jjan-text(#424242). */
  onColor?: string
}

/**
 * iOS 스타일 토글 스위치 (시각 전용).
 * 클릭 핸들러는 부모가 wrapper button 으로 감싸서 제어 (이 컴포넌트는 시각만).
 */
export default function ToggleSwitch({
  on,
  offColor = '#cfcfcf',
  onColor = '#424242',
}: ToggleSwitchProps) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{
        width: 54,
        height: 30,
        backgroundColor: on ? onColor : offColor,
        transition: 'background-color 0.15s',
      }}
    >
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 26,
          height: 26,
          top: 2,
          left: on ? 26 : 2,
          transition: 'left 0.15s',
        }}
      />
    </div>
  )
}
