import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/feed', label: '피드', icon: '📰' },
  { to: '/profile', label: '프로필', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex h-16 max-w-md mx-auto items-center justify-around border-t border-gray-100 bg-white">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs ${isActive ? 'text-yellow-400' : 'text-gray-400'}`
          }
        >
          <span className="text-xl">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
