import { Outlet } from 'react-router-dom'
import ToastContainer from '@/shared/components/ui/ToastContainer'

const FRAME_WIDTH = 390
const FRAME_HEIGHT = 852

export default function MobileLayout() {
  return (
    <div
      className="flex justify-center bg-gray-200"
      style={{ minHeight: '100dvh' }}
    >
      <div
        className="relative flex flex-col bg-white shrink-0 overflow-hidden"
        style={{
          width: FRAME_WIDTH,
          height: '100dvh',
          minHeight: FRAME_HEIGHT,
          minWidth: FRAME_WIDTH,
        }}
      >
        <Outlet />
        <ToastContainer />
      </div>
    </div>
  )
}
