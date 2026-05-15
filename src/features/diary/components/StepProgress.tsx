interface StepProgressProps {
  current: 1 | 2 | 3
  total?: number
}

export default function StepProgress({ current, total = 3 }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between px-[39px] pt-[28px]">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i < current
        return (
          <div
            key={i}
            className="h-[8px] rounded-full"
            style={{
              width: 102,
              backgroundColor: isActive ? '#91ccff' : '#e8e8e8',
              transition: 'background-color 0.2s',
            }}
          />
        )
      })}
    </div>
  )
}
