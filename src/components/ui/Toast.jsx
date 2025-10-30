
import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

const toastStore = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  },
  notify(toast) {
    this.listeners.forEach((listener) => listener(toast))
  },
}

export const useToast = () => {
  return {
    success: (message, duration = 3000) => {
      toastStore.notify({ id: Date.now(), type: "success", message, duration })
    },
    error: (message, duration = 3000) => {
      toastStore.notify({ id: Date.now(), type: "error", message, duration })
    },
    info: (message, duration = 3000) => {
      toastStore.notify({ id: Date.now(), type: "info", message, duration })
    },
  }
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = toastStore.subscribe((toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, toast.duration)
    })
    return unsubscribe
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white animate-fade-in ${
            toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {toast.type === "success" && <CheckCircle size={20} />}
          {toast.type === "error" && <AlertCircle size={20} />}
          {toast.type === "info" && <Info size={20} />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="hover:opacity-80">
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
