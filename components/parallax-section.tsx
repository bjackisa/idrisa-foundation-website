"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  bgImage?: string
  speed?: number
  overlay?: boolean
  className?: string
}

export function ParallaxSection({
  children,
  bgImage,
  speed = 0.5,
  overlay = true,
  className = "",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrolled = window.scrollY
      const sectionTop = sectionRef.current.offsetTop
      const offset = (scrolled - sectionTop + window.innerHeight) * speed

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        bgRef.current.style.transform = `translateY(${offset * 0.3}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <>
          <div
            ref={bgRef}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${bgImage})`,
              top: "-20%",
              bottom: "-20%",
              height: "140%",
            }}
          />
          {overlay && <div className="absolute inset-0 bg-primary/80" />}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
