"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  to: number
  duration?: number
}

export function AnimatedCounter({ to, duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    let start = 0
    let startTime: number | undefined

    function animate(ts: number) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor(progress * (to - start) + start))
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate)
      } else {
        setCount(to)
      }
    }

    raf.current = requestAnimationFrame(animate)

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current)
      }
    }
  }, [to, duration])

  return <span>{count}</span>
}
