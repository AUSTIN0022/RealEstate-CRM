import { useState, useEffect } from "react"
import { X } from "lucide-react"

export const Drawer = ({ isOpen, onClose, title, children, width = "w-96" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    
    if (isOpen) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else if (isVisible) {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose} 
      />
      <div 
        className={`absolute right-0 top-0 h-full ${width} max-w-full sm:max-w-md md:max-w-lg lg:${width} bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1 -m-1 transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  )
}