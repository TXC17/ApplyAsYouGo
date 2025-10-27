"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Card } from "@/components/ui/card"
import { InternshipNavigation } from "./internship-navigation"
import { useAuth } from "@/app/context/context"

interface LayoutWrapperProps {
  children: ReactNode
  title: string
}

export function LayoutWrapper({ children, title }: LayoutWrapperProps) {
  const { user } = useAuth()
  
  // Use real user data from authentication
  const userData = user || {
    name: "User",
    email: "user@example.com",
    profileImage: "/placeholder.svg?height=100&width=100",
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] text-[#f1eece]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Sidebar / Navigation */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <Sidebar user={userData} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Internship Sources Card */}
            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#f1eece] mb-6">Internship Sources</h2>
                <InternshipNavigation />
                {children}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
