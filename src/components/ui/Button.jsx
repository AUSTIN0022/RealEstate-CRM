export const Button = ({
  children,
  variant = "primary",
  size = "sm",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const baseClasses = "font-medium rounded-xl transition duration-200 flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400",
    success: "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-900 disabled:bg-gray-50",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />}
      {children}
    </button>
  )
}
