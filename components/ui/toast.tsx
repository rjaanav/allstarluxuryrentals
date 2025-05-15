"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  id: string
  message: string
  type?: ToastType
  onClose: (id: string) => void
}

export function Toast({ id, message, type = "info", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Wait for exit animation to complete
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }[type]

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex w-full max-w-md transform items-center rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800",
        {
          success: "border-l-4 border-green-500",
          error: "border-l-4 border-red-500",
          info: "border-l-4 border-blue-500",
          warning: "border-l-4 border-yellow-500",
        }[type],
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
      role="alert"
    >
      <div className="mr-3 flex-shrink-0">
        <Icon
          className={cn(
            "h-5 w-5",
            {
              success: "text-green-500",
              error: "text-red-500",
              info: "text-blue-500",
              warning: "text-yellow-500",
            }[type],
          )}
        />
      </div>
      <div className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{message}</div>
      <button
        type="button"
        className="ml-auto inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:hover:text-gray-100"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  onClose: (id: string) => void
}) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} onClose={onClose} />
      ))}
    </div>
  )
}
