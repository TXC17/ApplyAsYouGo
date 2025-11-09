"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/context"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, Phone, Save } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isLoggedIn, AuthorizationToken } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    // Initialize profile data with user data
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: "", // Phone not available in current user object
      })
    }
  }, [isLoggedIn, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AuthorizationToken
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Profile updated successfully!")
      } else {
        toast.error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error("Failed to connect to server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] text-[#f1eece] p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-[#f1eece] hover:bg-[#f1eece]/10"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        {/* Profile Form */}
        <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7d0d1b] to-[#a90519] flex items-center justify-center text-[#f1eece] text-2xl font-bold">
                {profileData.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#f1eece]">Personal Information</h2>
                <p className="text-[#f1eece]/70">Update your profile details</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#f1eece] flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#f1eece] flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
                  placeholder="Enter your email address"
                  required
                  disabled // Email should not be editable
                />
                <p className="text-xs text-[#f1eece]/50">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#f1eece] flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] h-12"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}