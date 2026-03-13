interface SettingItemProps {
  label: string
  onClick?: () => void
  right?: React.ReactNode
}

export default function SettingItem({ label, onClick, right }: SettingItemProps) {
  return (
    <div onClick={onClick}>
      <span>{label}</span>
      {right}
    </div>
  )
}
