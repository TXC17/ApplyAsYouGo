"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { User, Briefcase, Settings, LogOut } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/app/context/context"
import { useRouter } from "next/navigation"

interface SidebarProps {
  user: {
    name: string
    email: string
    profileImage: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const { logoutUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const clock = document.getElementById("system-clock")
    const date = document.getElementById("system-date")

    function updateTime() {
      const now = new Date()
      if (clock) {
        clock.textContent = now.toLocaleTimeString("en-US", { hour12: false })
      }
      if (date) {
        date.textContent = now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      }
    }

    const intervalId = setInterval(updateTime, 1000)
    updateTime()

    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[rgba(30,30,35,0.5)] flex items-center justify-center overflow-hidden mb-4 border-2 border-[#f1eece]/30">
              <img
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-[#f1eece]">{user.name}</h2>
            <p className="text-[#f1eece]/70 text-sm">{user.email}</p>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
            >
              <User size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/internships/linkedin"
              className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(30,30,35,0.5)] text-[#f1eece] hover:bg-[rgba(30,30,35,0.7)] transition-colors"
            >
              <Briefcase size={18} />
              <span>Internships</span>
            </Link>
            <Link
              href="/resume-builder"
              className="flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
            >
              <Settings size={18} />
              <span>Resume Builder</span>
            </Link>
            <button
              onClick={() => {
                logoutUser()
                router.push("/")
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </Card>

      <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden mt-6">
        <div className="p-6 text-center space-y-6">
          <div>
            <h4 className="text-xs uppercase text-[#f1eece]/40 tracking-wide">System Time</h4>
            <h1 className="text-4xl font-semibold text-[#f1eece] tracking-wider" id="system-clock">
              00:00:00
            </h1>
            <p className="text-[#f1eece]/60 text-sm tracking-wide mt-1" id="system-date">
              Apr 10, 2025
            </p>
          </div>
        </div>
      </Card>
    </>
  )
}
