import { useEffect, useRef, useState } from 'react'

const AnimatedBackground3D = () => {
  const canvasRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []
    let animationId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.z = Math.random() * 1000
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.speedZ = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.2
        this.hue = Math.random() * 60 + 200 // Blue to purple range
      }

      update() {
        // 3D movement
        this.z -= this.speedZ
        if (this.z <= 0) {
          this.reset()
          this.z = 1000
        }

        // Mouse interaction
        const dx = mousePosition.x - this.x
        const dy = mousePosition.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          const force = (150 - distance) / 150
          this.x -= (dx / distance) * force * 2
          this.y -= (dy / distance) * force * 2
        }

        // Boundary check
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1

        this.x += this.speedX
        this.y += this.speedY
      }

      draw() {
        const perspective = 1000 / (1000 + this.z)
        const projectedX = (this.x - canvas.width / 2) * perspective + canvas.width / 2
        const projectedY = (this.y - canvas.height / 2) * perspective + canvas.height / 2
        const projectedSize = this.size * perspective

        ctx.beginPath()
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * perspective})`
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = `hsla(${this.hue}, 70%, 60%, ${this.opacity * perspective * 0.5})`
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    // Initialize particles
    const particleCount = Math.min(150, window.innerWidth / 10)
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Connection lines between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      drawConnections()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Mouse move handler
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [mousePosition])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
    />
  )
}

export default AnimatedBackground3D
