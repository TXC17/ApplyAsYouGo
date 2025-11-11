"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, MapPin, Briefcase, FileText, Save } from "lucide-react"
import { useAuth } from "@/app/context/context"

interface ApplicationProfile {
  fullName: string
  email: string
  phone: string
  location: string
  currentEducation: string
  graduationYear: string
  skills: string
  experience: string
  coverLetter: string
  linkedinUrl: string
  portfolioUrl: string
  githubUrl: string
}

export default function ApplicationProfileForm() {
  const { AuthorizationToken, isLoggedIn, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profile, setProfile] = useState<ApplicationProfile>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    currentEducation: "",
    graduationYear: "",
    skills: "",
    experience: "",
    coverLetter: "",
    linkedinUrl: "",
    portfolioUrl: "",
    githubUrl: "",
  })

  // Load existing profile on mount
  useEffect(() => {
    if (isLoggedIn && AuthorizationToken) {
      loadProfile()
    }
  }, [isLoggedIn, AuthorizationToken])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/user/application-profile`,
        {
          headers: {
            Authorization: AuthorizationToken,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setProfile(data.profile)
        } else if (user) {
          // Pre-fill with user data if no profile exists
          setProfile((prev) => ({
            ...prev,
            fullName: user.name || "",
            email: user.email || "",
          }))
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    // Validation
    if (!profile.fullName || !profile.email || !profile.phone) {
      toast.error("Please fill in all required fields (Name, Email, Phone)")
      return
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(profile.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    try {
      setIsSaving(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/user/application-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthorizationToken,
          },
          body: JSON.stringify({ profile }),
        }
      )

      if (response.ok) {
        toast.success("Application profile saved successfully!")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to save profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("An error occurred while saving profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-[#f1eece]/70">Loading profile...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#f1eece] mb-2">Application Profile</h2>
        <p className="text-sm text-[#f1eece]/60 mb-6">
          This information will be used to automatically fill application forms
        </p>

        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#f1eece]/80 flex items-center">
                <User size={16} className="mr-2" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#f1eece]/80">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#f1eece]/80 flex items-center">
                <Phone size={16} className="mr-2" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#f1eece]/80 flex items-center">
                <MapPin size={16} className="mr-2" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                placeholder="Mumbai, India"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>
          </div>

          {/* Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentEducation" className="text-[#f1eece]/80 flex items-center">
                <Briefcase size={16} className="mr-2" />
                Current Education
              </Label>
              <Input
                id="currentEducation"
                name="currentEducation"
                value={profile.currentEducation}
                onChange={handleInputChange}
                placeholder="B.Tech in Computer Science"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-[#f1eece]/80">
                Graduation Year
              </Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleInputChange}
                placeholder="2025"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-[#f1eece]/80">
              Skills (comma-separated)
            </Label>
            <Input
              id="skills"
              name="skills"
              value={profile.skills}
              onChange={handleInputChange}
              placeholder="React, Node.js, Python, MongoDB"
              className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-[#f1eece]/80">
              Experience / Projects
            </Label>
            <Textarea
              id="experience"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              placeholder="Describe your relevant experience or projects..."
              rows={3}
              className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
            />
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-[#f1eece]/80 flex items-center">
              <FileText size={16} className="mr-2" />
              Default Cover Letter
            </Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={profile.coverLetter}
              onChange={handleInputChange}
              placeholder="Write a default cover letter that will be used for applications..."
              rows={4}
              className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="text-[#f1eece]/80">
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={profile.linkedinUrl}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/..."
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioUrl" className="text-[#f1eece]/80">
                Portfolio URL
              </Label>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                value={profile.portfolioUrl}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-[#f1eece]/80">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={profile.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/..."
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
