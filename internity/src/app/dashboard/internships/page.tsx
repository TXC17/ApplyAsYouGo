"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Building, MapPin, Clock, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { LayoutWrapper } from "./components/layout-wrapper"
import { useRouter } from "next/navigation"
import { PreferencesSectionBase, type PreferencesData } from "./components/preferences-section-base"
import { toast } from "sonner"

// Type definitions for the internship data structures
interface LinkedInInternship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  category: string
  source: "linkedin"
}

interface InternshalaInternship {
  id: string
  title: string
  company: string
  applicants: string
  days_left: string
  skills: string[]
  category: string
  scraped_at: string
  url: string | null
  source: "internshala"
}

interface UnstopInternship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  category: string
  source: "unstop"
}

// Union type for all internship types
type Internship = LinkedInInternship | InternshalaInternship | UnstopInternship

export default function InternshipsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [internships, setInternships] = useState<Internship[]>([])

  // Mock data for all platforms
  const mockInternships: Internship[] = [
    {
      id: "li1",
      title: "Web Development",
      company: "Foodcow",
      location: "Chennai",
      duration: "3 Months",
      stipend: "₹ 5,000 - 10,000 /month",
      category: "web-development-internship",
      source: "linkedin",
    },
    {
      id: "in1",
      title: "WordPress Developer",
      company: "Godwin Vox Dei",
      applicants: "N/A",
      days_left: "10",
      skills: ["Fresher"],
      category: "full-stack-development",
      scraped_at: "2025-04-10T16:02:37.458Z",
      url: null,
      source: "internshala",
    },
    {
      id: "un1",
      title: "Machine Learning Engineer",
      company: "AI Solutions",
      location: "Hyderabad",
      duration: "6 Months",
      stipend: "₹ 25,000 /month",
      category: "machine-learning-internship",
      source: "unstop",
    },
  ]

  // Load initial data
  useEffect(() => {
    setInternships(mockInternships)
  }, [])

  // Handle scraping for all platforms
  const handleScrapeAll = async () => {
    setIsLoading(true)

    // In a real app, this would call the API to scrape all platforms
    // For now, we'll simulate a delay and then update with mock data
    setTimeout(() => {
      setInternships([...mockInternships])
      setIsLoading(false)
    }, 2000)
  }

  // Navigate to specific platform page
  const navigateToPlatform = (platform: string) => {
    router.push(`/dashboard/internships/${platform}`)
  }

  // Handle saving general preferences
  const handleSavePreferences = (preferences: PreferencesData) => {
    console.log("Saving general preferences:", preferences)

    // In a real app, this would save the preferences to the backend
    // fetch('/api/preferences', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(preferences)
    // })

    toast.success("General preferences saved successfully!")
  }

  // Render internship card based on its type
  const renderInternshipCard = (internship: Internship) => {
    return (
      <motion.div
        key={internship.id}
        className="bg-[rgba(19,19,24,0.85)] text-[#f1eece] border border-[#f1eece]/20 rounded-xl p-4 shadow transition hover:scale-[1.01] cursor-pointer"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        onClick={() => navigateToPlatform(internship.source)}
      >
        <div className="flex flex-col h-full">
          <h4 className="text-lg font-semibold text-[#f1eece]">{internship.title}</h4>
          <div className="flex items-center text-[#f1eece]/70 mt-1">
            <Building size={16} className="mr-1" />
            {internship.company}
          </div>

          {internship.source === "internshala" ? (
            <>
              <div className="flex items-center justify-between mt-3">
                <div className="text-[#f1eece]/70 text-sm">
                  <span className="font-medium">Applicants:</span> {internship.applicants}
                </div>
                <div className="text-[#f1eece]/70 text-sm">
                  <span className="font-medium">Days Left:</span> {internship.days_left}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {internship.skills.map((skill, index) => (
                  <Badge key={index} className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2 mt-3">
              {"location" in internship && (
                <div className="flex items-center text-[#f1eece]/70 text-sm">
                  <MapPin size={14} className="mr-1" />
                  {internship.location}
                </div>
              )}
              {"duration" in internship && (
                <div className="flex items-center text-[#f1eece]/70 text-sm">
                  <Clock size={14} className="mr-1" />
                  {internship.duration}
                </div>
              )}
              {"stipend" in internship && (
                <div className="flex items-center text-[#f1eece]/70 text-sm">
                  <DollarSign size={14} className="mr-1" />
                  {internship.stipend}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-3 flex justify-between items-center">
            <Badge className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
              {internship.category}
            </Badge>
            <Badge className="bg-[rgba(30,30,35,0.5)] text-[#f1eece]/90 border border-[#f1eece]/20 capitalize">
              {internship.source}
            </Badge>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <LayoutWrapper title="All Internships">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#f1eece]">All Internships</h3>
        <Button
          onClick={handleScrapeAll}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
              Scraping All...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Scrape All Platforms
            </>
          )}
        </Button>
      </div>

      <div className="mb-6 text-[#f1eece]/70 text-sm bg-[rgba(30,30,35,0.5)] p-4 rounded-lg">
        This is an overview of internships from all platforms. Click on any internship card to go to its specific
        platform page, or use the tabs above to navigate directly to a platform.
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-[#f1eece]/70">Scraping internships from all platforms...</span>
        </div>
      ) : internships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship) => renderInternshipCard(internship))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#f1eece]/50">
          <p>No internships found. Click "Scrape All Platforms" to fetch the latest listings.</p>
        </div>
      )}

      {/* General preferences section */}
      <div className="mt-6">
        <PreferencesSectionBase onSave={handleSavePreferences} title="General Application Preferences" />
      </div>
    </LayoutWrapper>
  )
}
