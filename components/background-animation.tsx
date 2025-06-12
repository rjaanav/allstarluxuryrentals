"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

interface BackgroundAnimationProps {
  variant?: "particles" // Only keeping the particles variant
  intensity?: "low" | "medium" | "high"
  className?: string
}

export function BackgroundAnimation({
  variant = "particles",
  intensity = "medium",
  className = "",
}: BackgroundAnimationProps) {
  const { theme } = useTheme()
  const isMobile = useMobile()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Prevent hydration mismatch by only determining theme after mount
  useEffect(() => {
    setMounted(true)
    setIsDark(theme === "dark")
  }, [theme])

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
      low: isMobile ? 10 : 25,
      medium: isMobile ? 20 : 50,
      high: isMobile ? 30 : 75,
    }
    return intensityMap[intensity]
  }

  // Particles animation
  useEffect(() => {
    if (!mounted || !canvasRef.current) return

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
      const particleCount = getElementCount()
      particles = []

      for (let i = 0; i < particleCount; i++) {
        const colorIndex = Math.floor(Math.random() * brandColors.all.length)
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1.5, // Slightly larger particles
          speedX: (Math.random() - 0.5) * 2, // Slightly slower for better aesthetics
          speedY: (Math.random() - 0.5) * 2,
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

          // Increased connection distance for more connections
          const maxDistance = isMobile ? 100 : 150

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${0.25 * (1 - distance / maxDistance)})`
              : `rgba(17, 24, 39, ${0.2 * (1 - distance / maxDistance)})`
            ctx.lineWidth = 1
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
  }, [mounted, intensity, isDark, isMobile])

  // Don't render during SSR to prevent hydration issues

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}
