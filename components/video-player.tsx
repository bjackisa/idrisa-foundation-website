"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"

interface VideoPlayerProps {
  thumbnailUrl: string
  videoId: string
  title: string
  className?: string
}

export function VideoPlayer({ thumbnailUrl, videoId, title, className = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {isPlaying ? (
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="relative aspect-video cursor-pointer group" onClick={() => setIsPlaying(true)}>
          <img
            src={thumbnailUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform animate-pulse-glow">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white text-lg font-semibold drop-shadow-lg">{title}</p>
          </div>
        </div>
      )}
    </div>
  )
}
