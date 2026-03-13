import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function Header({ title, showBack = false, right }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex h-14 items-center justify-between px-4">
      <div className="w-10">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-gray-600">
            ←
          </button>
        )}
      </div>
      <h1 className="text-base font-bold">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  )
}
