interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50'

  const variants = {
    primary: 'bg-yellow-400 text-white hover:bg-yellow-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg w-full',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingDots /> : children}
    </button>
  )
}

function LoadingDots() {
  return <span className="animate-pulse">...</span>
}
