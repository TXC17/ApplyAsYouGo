"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Navbar from "@/components/layout/Navbar"

export default function BuildResume() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize form data in localStorage if it doesn't exist
    if (!localStorage.getItem("resumeFormData")) {
      const initialData = {
        basicInfo: {
          name: "",
          email: "",
          phone: "",
          profilePicture: null,
        },
        education: [
          {
            degree: "",
            institution: "",
            year: "",
            id: "edu-1",
          },
        ],
        experience: [
          {
            title: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
            id: "exp-1",
          },
        ],
        skills: [],
      }
      localStorage.setItem("resumeFormData", JSON.stringify(initialData))
    }

    // Simulate loading for a better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Navigate to the first step after loading
      router.push("/resume-builder/steps/1")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  const handleGoToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#131318] to-[#1a1a20] text-[#f1eece]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#f1eece] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-xl text-[#f1eece]/80 mb-8">Preparing your resume builder...</p>
        
        <Button 
          onClick={handleGoToDashboard}
          className="bg-[rgba(30,30,35,0.7)] hover:bg-[rgba(40,40,45,0.7)] text-[#f1eece] border border-[#f1eece]/20 px-6 h-12"
        >
          <Home size={18} className="mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
    <Navbar/>
    </>
  )
}