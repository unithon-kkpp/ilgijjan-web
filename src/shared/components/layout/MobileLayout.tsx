import { Outlet } from 'react-router-dom'

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-[390px] shrink-0 min-h-screen bg-white relative overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}
