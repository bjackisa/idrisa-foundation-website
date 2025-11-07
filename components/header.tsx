"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [userType, setUserType] = useState<"admin" | "participant" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user has admin session
    const checkSession = async () => {
      try {
        const adminRes = await fetch("/api/admin/session")
        if (adminRes.ok) {
          setUserType("admin")
          setIsLoading(false)
          return
        }

        const participantRes = await fetch("/api/participant/session")
        if (participantRes.ok) {
          setUserType("participant")
          setIsLoading(false)
          return
        }

        setUserType(null)
      } catch (error) {
        setUserType(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleDashboardClick = () => {
    if (userType === "admin") {
      router.push("/admin/dashboard")
    } else if (userType === "participant") {
      router.push("/participant/dashboard")
    } else {
      router.push("/login")
    }
  }

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-12 h-12 flex-shrink-0">
            <img src="/logo.png" alt="Idrisa Foundation Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-lg leading-tight">Idrisa Foundation</div>
            <div className="text-xs text-primary-foreground/80 font-medium">Empowering Tomorrow's Minds</div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <Link href="/" className="hover:text-primary-foreground/80 transition text-sm font-medium">
            Home
          </Link>
          <Link href="/our-story" className="hover:text-primary-foreground/80 transition text-sm font-medium">
            Our Story
          </Link>
          <Link href="/our-programs" className="hover:text-primary-foreground/80 transition text-sm font-medium">
            Programs
          </Link>
          <Link href="/olympiad" className="hover:text-primary-foreground/80 transition text-sm font-medium">
            Olympiad
          </Link>
          <Link href="/impact" className="hover:text-primary-foreground/80 transition text-sm font-medium">
            Impact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && (
            <Button
              onClick={handleDashboardClick}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              {userType ? "Dashboard" : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
