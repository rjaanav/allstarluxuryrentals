"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

type AnimationVariant = "racing-lines" | "speedometer" | "particles" | "grid" | "minimal"

interface BackgroundAnimationProps {
  variant?: AnimationVariant
  intensity?: "low" | "medium" | "high"
  className?: string
  page?: string
}

export function BackgroundAnimation({
  variant = "racing-lines",
  intensity = "medium",
  className = "",
  page,
}: BackgroundAnimationProps) {
  const { theme } = useTheme()
  const { isMobile } = useMobile()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const isDark = theme === "dark"

  // Brand colors that work in both light and dark modes
  const getBrandColors = () => {
    // Primary brand colors
    const primaryColor = isDark ? "rgba(59, 130, 246, 0.5)" : "rgba(37, 99, 235, 0.4)" // Blue
    const accentColor = isDark ? "rgba(220, 38, 38, 0.5)" : "rgba(185, 28, 28, 0.4)" // Red
    const neutralColor = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(17, 24, 39, 0.25)" // White/Black
    const goldColor = isDark ? "rgba(234, 179, 8, 0.4)" : "rgba(202, 138, 4, 0.3)" // Gold
    const silverColor = isDark ? "rgba(209, 213, 219, 0.5)" : "rgba(156, 163, 175, 0.4)" // Silver

    return {
      primary: primaryColor,
      accent: accentColor,
      neutral: neutralColor,
      gold: goldColor,
      silver: silverColor,
      // Return an array of all colors for random selection
      all: [primaryColor, accentColor, neutralColor, goldColor, silverColor],
    }
  }

  // Determine the number of elements based on intensity and device
  const getElementCount = () => {
    const intensityMap = {
      low: isMobile ? 3 : 5,
      medium: isMobile ? 5 : 10,
      high: isMobile ? 8 : 15,
    }
    return intensityMap[intensity]
  }

  // Racing lines animation
  useEffect(() => {
    if (!mounted || variant !== "racing-lines" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lines: any[] = []
    const brandColors = getBrandColors()

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initLines()
    }

    const initLines = () => {
      const lineCount = getElementCount()
      lines = []

      for (let i = 0; i < lineCount; i++) {
        const width = Math.random() * 15 + 5
        const colorIndex = Math.floor(Math.random() * brandColors.all.length)
        lines.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 200 + 100,
          width,
          speed: Math.random() * 2 + 1,
          color: brandColors.all[colorIndex],
          curve: Math.random() * 0.5 - 0.25,
        })
      }
    }

    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

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
          line.x = canvas.width + 50
          line.y = Math.random() * canvas.height
          line.curve = Math.random() * 0.5 - 0.25
        }
      })

      animationFrameId = requestAnimationFrame(drawLines)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawLines()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted, variant, intensity, isDark, isMobile])

  // Speedometer animation
  useEffect(() => {
    if (!mounted || variant !== "speedometer" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let dials: any[] = []
    let time = 0
    const brandColors = getBrandColors()

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initDials()
    }

    const initDials = () => {
      const dialCount = getElementCount()
      dials = []

      for (let i = 0; i < dialCount; i++) {
        const size = Math.random() * 100 + 50
        const colorIndex = Math.floor(Math.random() * brandColors.all.length)
        dials.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speed: Math.random() * 0.02 + 0.01,
          offset: Math.random() * Math.PI * 2,
          color: brandColors.all[colorIndex],
          accentColor: i % 2 === 0 ? brandColors.accent : brandColors.gold,
        })
      }
    }

    const drawDials = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      dials.forEach((dial) => {
        ctx.beginPath()
        ctx.arc(dial.x, dial.y, dial.size, 0, Math.PI * 2)
        ctx.strokeStyle = dial.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw dial needle
        const angle = time * dial.speed + dial.offset
        const needleLength = dial.size * 0.8

        ctx.beginPath()
        ctx.moveTo(dial.x, dial.y)
        ctx.lineTo(dial.x + Math.cos(angle) * needleLength, dial.y + Math.sin(angle) * needleLength)
        ctx.strokeStyle = dial.accentColor
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw tick marks
        for (let i = 0; i < 12; i++) {
          const tickAngle = (i / 12) * Math.PI * 2
          const innerRadius = dial.size * 0.9
          const outerRadius = dial.size

          ctx.beginPath()
          ctx.moveTo(dial.x + Math.cos(tickAngle) * innerRadius, dial.y + Math.sin(tickAngle) * innerRadius)
          ctx.lineTo(dial.x + Math.cos(tickAngle) * outerRadius, dial.y + Math.sin(tickAngle) * outerRadius)
          ctx.strokeStyle = dial.color
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(drawDials)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawDials()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted, variant, intensity, isDark, isMobile])

  // Particles animation
  useEffect(() => {
    if (!mounted || variant !== "particles" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: any[] = []
    const brandColors = getBrandColors()

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const particleCount = getElementCount() * 5 // More particles for this effect
      particles = []

      for (let i = 0; i < particleCount; i++) {
        const colorIndex = Math.floor(Math.random() * brandColors.all.length)
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 3,
          speedY: (Math.random() - 0.5) * 3,
          color: brandColors.all[colorIndex],
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw connections between nearby particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`
              : `rgba(17, 24, 39, ${0.15 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted, variant, intensity, isDark, isMobile])

  // Grid animation
  useEffect(() => {
    if (!mounted || variant !== "grid" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    const gridSize = isMobile ? 30 : 50
    const brandColors = getBrandColors()

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      const rows = Math.ceil(canvas.height / gridSize) + 1
      const cols = Math.ceil(canvas.width / gridSize) + 1

      // Draw vertical lines
      for (let i = 0; i < cols; i++) {
        const x = i * gridSize + Math.sin(time + i * 0.1) * 5
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = i % 3 === 0 ? brandColors.primary : i % 3 === 1 ? brandColors.silver : brandColors.neutral
        ctx.lineWidth = i % 5 === 0 ? 1.5 : 1
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let i = 0; i < rows; i++) {
        const y = i * gridSize + Math.sin(time + i * 0.1) * 5
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = i % 4 === 0 ? brandColors.accent : i % 4 === 1 ? brandColors.gold : brandColors.neutral
        ctx.lineWidth = i % 6 === 0 ? 1.5 : 1
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(drawGrid)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawGrid()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted, variant, intensity, isDark, isMobile])

  // Minimal animation (subtle gradient movement)
  useEffect(() => {
    if (!mounted || variant !== "minimal" || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    const brandColors = getBrandColors()

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGradient = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.005

      const gradient = ctx.createLinearGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.2),
        0,
        canvas.width * (0.5 + Math.cos(time) * 0.2),
        canvas.height,
      )

      if (isDark) {
        gradient.addColorStop(0, "rgba(37, 99, 235, 0.2)") // Blue
        gradient.addColorStop(0.5, "rgba(220, 38, 38, 0.15)") // Red
        gradient.addColorStop(1, "rgba(17, 24, 39, 0.1)") // Dark gray
      } else {
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.15)") // Blue
        gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.1)") // Red
        gradient.addColorStop(1, "rgba(243, 244, 246, 0.05)") // Light gray
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some subtle curves
      const curveCount = getElementCount() / 2

      for (let i = 0; i < curveCount; i++) {
        ctx.beginPath()

        const y = canvas.height * (i / curveCount)
        ctx.moveTo(0, y)

        for (let x = 0; x < canvas.width; x += canvas.width / 10) {
          const waveHeight = 20 * Math.sin(time + i + x * 0.01)
          ctx.lineTo(x, y + waveHeight)
        }

        ctx.strokeStyle = i % 2 === 0 ? brandColors.primary : brandColors.silver
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(drawGradient)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawGradient()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted, variant, intensity, isDark, isMobile])

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which variant to use based on the page if not explicitly set
  useEffect(() => {
    if (page && !variant) {
      // You can customize which animation appears on which page
      const pageVariantMap: Record<string, AnimationVariant> = {
        home: "racing-lines",
        fleet: "grid",
        profile: "minimal",
        bookings: "speedometer",
        contact: "particles",
      }
      // Set the variant based on the page
    }
  }, [page, variant])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
