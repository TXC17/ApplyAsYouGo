"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Key, Mail, Hash, Tag, CheckCircle2, Circle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/app/context/context"

interface PlatformCredentials {
  enabled: boolean
  email: string
  password: string
  loginMethod: "email" | "google"
}

interface FormData {
  keywords: string
  max_applications: number
  max_pages: number
  platforms: {
    internshala: PlatformCredentials
    linkedin: PlatformCredentials
  }
}

export default function SmartScraperCredentialsForm() {
  const { AuthorizationToken, isLoggedIn } = useAuth()
  const keywordsList = ["web-development", "backend-development", "front-end-development", "machine-learning"]

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<any>(null)
  const [isPolling, setIsPolling] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    keywords: "web-development",
    max_applications: 20,
    max_pages: 2,
    platforms: {
      internshala: {
        enabled: true,  // Internshala is enabled by default
        email: "",
        password: "",
        loginMethod: "email",
      },
      linkedin: {
        enabled: false,  // LinkedIn is disabled (not implemented yet)
        email: "",
        password: "",
        loginMethod: "email",
      },
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "max_applications" || name === "max_pages") {
      setFormData({
        ...formData,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleKeywordsChange = (value: string) => {
    setFormData({
      ...formData,
      keywords: value,
    })
  }

  const handlePlatformToggle = (platform: keyof FormData["platforms"]) => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: {
          ...formData.platforms[platform],
          enabled: !formData.platforms[platform].enabled,
        },
      },
    })
  }

  const handlePlatformCredentialChange = (
    platform: keyof FormData["platforms"],
    field: "email" | "password",
    value: string
  ) => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: {
          ...formData.platforms[platform],
          [field]: value,
        },
      },
    })
  }

  const handleLoginMethodChange = (platform: keyof FormData["platforms"], method: "email" | "google") => {
    setFormData({
      ...formData,
      platforms: {
        ...formData.platforms,
        [platform]: {
          ...formData.platforms[platform],
          loginMethod: method,
          password: method === "google" ? "" : formData.platforms[platform].password,
        },
      },
    })
  }

  const handleAutomate = async () => {
    // Check if user is logged in
    if (!isLoggedIn || !AuthorizationToken) {
      toast.error("Please login to use automation")
      return
    }

    // Validate at least one platform is enabled
    const enabledPlatforms = Object.entries(formData.platforms).filter(([_, config]) => config.enabled)
    
    if (enabledPlatforms.length === 0) {
      toast.error("Please enable at least one platform")
      return
    }

    // Validate credentials for enabled platforms
    for (const [platform, config] of enabledPlatforms) {
      if (!config.email) {
        toast.error(`Please provide email for ${platform}`)
        return
      }
      
      if (config.loginMethod === "email" && !config.password) {
        toast.error(`Please provide password for ${platform}`)
        return
      }
    }

    if (formData.max_applications < 1 || formData.max_pages < 1) {
      toast.error("Max applications and pages must be at least 1")
      return
    }

    const requestBody = {
      keywords: formData.keywords,
      max_applications: formData.max_applications,
      max_pages: formData.max_pages,
      platforms: formData.platforms,
    }

    try {
      toast.success("Starting automation process...")

      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/v1/internships/search_and_apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": AuthorizationToken,
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Automation started successfully:", data)
        
        if (data.task_id) {
          setActiveTaskId(data.task_id)
          setIsPolling(true)
          toast.success(`Automation started! Task ID: ${data.task_id}`)
        } else {
          toast.success("Automation started successfully!")
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to start automation. Please try again.")
      }
    } catch (error) {
      console.error("Error starting automation:", error)
      toast.error("An error occurred while starting automation. Please try again.")
    }
  }

  // Poll for task status
  useEffect(() => {
    if (!isPolling || !activeTaskId || !AuthorizationToken) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/internships/status/${activeTaskId}`,
          {
            headers: {
              Authorization: AuthorizationToken,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setTaskStatus(data.task)

          // Check if task is completed
          if (data.task?.status === "completed" || data.task?.status === "failed") {
            setIsPolling(false)
            
            if (data.task.status === "completed") {
              const totalApplied = Object.values(data.task.platforms || {}).reduce(
                (sum: number, platform: any) => sum + (platform.total_applied || 0),
                0
              )
              toast.success(`Automation completed! Applied to ${totalApplied} internships.`)
            } else {
              toast.error("Automation failed. Please check the status below.")
            }
          }
        }
      } catch (error) {
        console.error("Error polling task status:", error)
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(pollInterval)
  }, [isPolling, activeTaskId, AuthorizationToken])

  return (
    <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#f1eece] mb-4">Automated Internship Applier</h2>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-[#f1eece]/80 flex items-center">
              <Tag size={16} className="mr-2" />
              Keywords
            </Label>
            <Select value={formData.keywords} onValueChange={handleKeywordsChange}>
              <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]">
                <SelectValue placeholder="Select keywords" />
              </SelectTrigger>
              <SelectContent className="bg-[rgba(30,30,35,0.95)] border-[#f1eece]/20 text-[#f1eece]">
                {keywordsList.map((keyword) => (
                  <SelectItem key={keyword} value={keyword} className="hover:bg-[rgba(40,40,45,0.8)]">
                    {keyword}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_applications" className="text-[#f1eece]/80 flex items-center">
                <Hash size={16} className="mr-2" />
                Max Applications
              </Label>
              <Input
                id="max_applications"
                name="max_applications"
                type="number"
                value={formData.max_applications}
                onChange={handleInputChange}
                min={1}
                max={100}
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_pages" className="text-[#f1eece]/80 flex items-center">
                <Hash size={16} className="mr-2" />
                Max Pages
              </Label>
              <Input
                id="max_pages"
                name="max_pages"
                type="number"
                value={formData.max_pages}
                onChange={handleInputChange}
                min={1}
                max={10}
                className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#f1eece]/10">
            <h3 className="text-lg font-semibold text-[#f1eece] mb-4">Platform Credentials</h3>
            <p className="text-sm text-[#f1eece]/60 mb-4">
              Enable platforms and provide credentials for each one you want to use
            </p>

            {/* Internshala */}
            <div className="mb-6 p-4 rounded-lg bg-[rgba(30,30,35,0.3)] border border-[#f1eece]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internshala-enabled"
                    checked={formData.platforms.internshala.enabled}
                    onCheckedChange={() => handlePlatformToggle("internshala")}
                    className="border-[#f1eece]/40"
                  />
                  <Label htmlFor="internshala-enabled" className="text-[#f1eece] font-semibold cursor-pointer">
                    Internshala
                  </Label>
                </div>
                {formData.platforms.internshala.enabled && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
              </div>

              {formData.platforms.internshala.enabled && (
                <div className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-[#f1eece]/70 text-sm">Login Method</Label>
                    <Select
                      value={formData.platforms.internshala.loginMethod}
                      onValueChange={(value: "email" | "google") => handleLoginMethodChange("internshala", value)}
                    >
                      <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[rgba(30,30,35,0.95)] border-[#f1eece]/20 text-[#f1eece]">
                        <SelectItem value="email">Email & Password</SelectItem>
                        <SelectItem value="google">Google Login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#f1eece]/70 text-sm flex items-center">
                      <Mail size={14} className="mr-2" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.platforms.internshala.email}
                      onChange={(e) => handlePlatformCredentialChange("internshala", "email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                    />
                  </div>

                  {formData.platforms.internshala.loginMethod === "email" && (
                    <div className="space-y-2">
                      <Label className="text-[#f1eece]/70 text-sm flex items-center">
                        <Key size={14} className="mr-2" />
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={formData.platforms.internshala.password}
                        onChange={(e) => handlePlatformCredentialChange("internshala", "password", e.target.value)}
                        placeholder="••••••••"
                        className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                      />
                    </div>
                  )}

                  {formData.platforms.internshala.loginMethod === "google" && (
                    <p className="text-xs text-[#f1eece]/50 italic">
                      A browser window will open for Google authentication when automation starts
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* LinkedIn */}
            <div className="mb-6 p-4 rounded-lg bg-[rgba(30,30,35,0.3)] border border-[#f1eece]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="linkedin-enabled"
                    checked={formData.platforms.linkedin.enabled}
                    onCheckedChange={() => handlePlatformToggle("linkedin")}
                    className="border-[#f1eece]/40"
                  />
                  <Label htmlFor="linkedin-enabled" className="text-[#f1eece] font-semibold cursor-pointer">
                    LinkedIn
                  </Label>
                </div>
                {formData.platforms.linkedin.enabled && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
              </div>

              {formData.platforms.linkedin.enabled && (
                <div className="space-y-3 mt-3">
                  <div className="space-y-2">
                    <Label className="text-[#f1eece]/70 text-sm">Login Method</Label>
                    <Select
                      value={formData.platforms.linkedin.loginMethod}
                      onValueChange={(value: "email" | "google") => handleLoginMethodChange("linkedin", value)}
                    >
                      <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[rgba(30,30,35,0.95)] border-[#f1eece]/20 text-[#f1eece]">
                        <SelectItem value="email">Email & Password</SelectItem>
                        <SelectItem value="google">Google Login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#f1eece]/70 text-sm flex items-center">
                      <Mail size={14} className="mr-2" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.platforms.linkedin.email}
                      onChange={(e) => handlePlatformCredentialChange("linkedin", "email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                    />
                  </div>

                  {formData.platforms.linkedin.loginMethod === "email" && (
                    <div className="space-y-2">
                      <Label className="text-[#f1eece]/70 text-sm flex items-center">
                        <Key size={14} className="mr-2" />
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={formData.platforms.linkedin.password}
                        onChange={(e) => handlePlatformCredentialChange("linkedin", "password", e.target.value)}
                        placeholder="••••••••"
                        className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                      />
                    </div>
                  )}

                  {formData.platforms.linkedin.loginMethod === "google" && (
                    <p className="text-xs text-[#f1eece]/50 italic">
                      A browser window will open for Google authentication when automation starts
                    </p>
                  )}
                </div>
              )}
            </div>


          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={handleAutomate}
              disabled={isPolling}
              className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none disabled:opacity-50"
            >
              {isPolling ? "Automation Running..." : "Automate"}
            </Button>
          </div>
        </form>

        {/* Task Status Display */}
        {taskStatus && (
          <div className="mt-6 p-4 rounded-lg bg-[rgba(30,30,35,0.5)] border border-[#f1eece]/20">
            <h3 className="text-lg font-semibold text-[#f1eece] mb-3">Automation Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#f1eece]/70">Status:</span>
                <span className={`font-semibold ${
                  taskStatus.status === "completed" ? "text-green-400" :
                  taskStatus.status === "failed" ? "text-red-400" :
                  taskStatus.status === "running" ? "text-yellow-400" :
                  "text-[#f1eece]"
                }`}>
                  {taskStatus.status?.toUpperCase()}
                </span>
              </div>
              
              {taskStatus.platforms && Object.entries(taskStatus.platforms).map(([platform, data]: [string, any]) => (
                <div key={platform} className="mt-3 p-3 rounded bg-[rgba(40,40,45,0.5)]">
                  <div className="font-semibold text-[#f1eece] capitalize mb-2">{platform}</div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#f1eece]/70">Status:</span>
                      <span className={`${
                        data.status === "completed" ? "text-green-400" :
                        data.status === "failed" || data.status === "error" ? "text-red-400" :
                        "text-yellow-400"
                      }`}>
                        {data.status}
                      </span>
                    </div>
                    {data.total_applied !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-[#f1eece]/70">Applications:</span>
                        <span className="text-[#f1eece]">{data.total_applied}</span>
                      </div>
                    )}
                    {data.message && (
                      <div className="text-[#f1eece]/60 text-xs mt-2">{data.message}</div>
                    )}
                    {data.error && (
                      <div className="text-red-400 text-xs mt-2">Error: {data.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
