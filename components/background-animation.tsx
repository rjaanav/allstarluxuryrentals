"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface BackgroundAnimationProps {
  className?: string
}

export function BackgroundAnimation({ className = "" }: BackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lines: any[] = []

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      // Set canvas dimensions with device pixel ratio for sharp rendering
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Scale the context to ensure correct drawing dimensions
      ctx.scale(dpr, dpr)

      // Set display size (css pixels)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      initLines()
    }

    const initLines = () => {
      const lineCount = window.innerWidth < 768 ? 5 : 10
      lines = []

      for (let i = 0; i < lineCount; i++) {
        lines.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 200 + 100,
          width: Math.random() * 5 + 2,
          speed: Math.random() * 2 + 1,
          color: isDark
            ? `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`
            : `rgba(0, 0, 0, ${Math.random() * 0.15 + 0.05})`,
          curve: Math.random() * 0.5 - 0.25,
        })
      }
    }

    const drawLines = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      lines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.x, line.y)

        // Create a curved line
        const cp1x = line.x + line.length * 0.3
        const cp1y = line.y + line.curve * 100
        const cp2x = line.x + line.length * 0.6
        const cp2y = line.y + line.curve * 200
        const endX = line.x + line.length
        const endY = line.y + line.curve * 300

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
        ctx.lineWidth = line.width
        ctx.strokeStyle = line.color
        ctx.lineCap = "round"
        ctx.stroke()

        // Move the line
        line.x -= line.speed

        // Reset when line goes off screen
        if (line.x + line.length < 0) {
          line.x = canvas.width / window.devicePixelRatio + 50
          line.y = Math.random() * (canvas.height / window.devicePixelRatio)
          line.curve = Math.random() * 0.5 - 0.25
        }
      })

      animationFrameId = requestAnimationFrame(drawLines)
    }

    // Add event listeners
    window.addEventListener("resize", resizeCanvas)

    // Initial setup
    resizeCanvas()
    drawLines()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        opacity: 1,
      }}
      aria-hidden="true"
    />
  )
}
