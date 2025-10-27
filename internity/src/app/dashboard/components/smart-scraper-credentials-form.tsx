"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Check, Key, Mail, Hash, Tag } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SmartScraperCredentialsForm() {
  const keywordsList = ["web-development", "backend-development", "front-end-development", "machine-learning", "blockchain-development"]

  const [formData, setFormData] = useState({
    keywords: "web-development",
    max_applications: 20,
    max_pages: 2,
    credentials: {
      email: "",
      password: "",
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "email" || name === "password") {
      setFormData({
        ...formData,
        credentials: {
          ...formData.credentials,
          [name]: value,
        },
      })
    } else if (name === "max_applications" || name === "max_pages") {
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

  const handleAutomate = async () => {
    // Validate form data
    if (!formData.credentials.email || !formData.credentials.password) {
      toast.error("Please provide both email and password credentials")
      return
    }

    if (formData.max_applications < 1 || formData.max_pages < 1) {
      toast.error("Max applications and pages must be at least 1")
      return
    }

    const requestBody = {
      keywords: formData.keywords,
      max_applications: formData.max_applications,
      max_pages: formData.max_pages,
      credentials: {
        email: formData.credentials.email,
        password: formData.credentials.password,
      },
    }

    try {
      // For now, we'll simulate the automation process
      toast.success("Automation request submitted! The AI agent will start processing your preferences.")
      
      // In a real implementation, this would call the backend automation service
      /*
      const response = await fetch("http://127.0.0.1:5000/api/v1/internships/search_and_apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Automation started successfully:", data)
        toast.success("Automation started successfully! Check your applications tab for updates.")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to start automation. Please try again.")
      }
      */
    } catch (error) {
      console.error("Error starting automation:", error)
      toast.error("An error occurred while starting automation. Please try again.")
    }
  }

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
            <h3 className="text-lg font-semibold text-[#f1eece] mb-4">Credentials</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#f1eece]/80 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.credentials.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#f1eece]/80 flex items-center">
                  <Key size={16} className="mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/20 text-[#f1eece]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={handleAutomate}
              className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
            >
              Automate
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
