"use client"

import { useState } from "react"

type Props = {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function ImageWithFallback({ src, alt, className, fallbackSrc = "/placeholder-user.jpg" }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  )
}
