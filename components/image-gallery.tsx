"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)
  const goToPrev = () => setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
  const goToNext = () => setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null))

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group img-zoom"
            onClick={() => openLightbox(index)}
          >
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">View</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goToPrev}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
            <img
              src={images[selectedIndex].src || "/placeholder.svg"}
              alt={images[selectedIndex].alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
            {images[selectedIndex].caption && (
              <p className="text-white text-center mt-4 text-lg">{images[selectedIndex].caption}</p>
            )}
            <p className="text-white/60 text-sm mt-2">
              {selectedIndex + 1} of {images.length}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
