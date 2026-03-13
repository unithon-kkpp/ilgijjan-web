interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`rounded-xl border border-gray-200 px-4 py-2.5 text-base outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}
