interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 배경 딤처리 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* 모달 패널 */}
      <div className="relative w-full max-w-md rounded-t-2xl bg-white p-6">
        {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
