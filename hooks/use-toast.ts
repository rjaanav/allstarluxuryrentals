"use client"

import { useState } from "react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    if (duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message: string, duration?: number) => addToast(message, "success", duration)
  const error = (message: string, duration?: number) => addToast(message, "error", duration)
  const info = (message: string, duration?: number) => addToast(message, "info", duration)
  const warning = (message: string, duration?: number) => addToast(message, "warning", duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
