"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone } from "lucide-react"
import { useResumeForm } from "../../components/resume-form-context"

export default function BasicInfoStepContent() {
  const { formData, previewUrl, handleBasicInfoChange, handleFileChange } = useResumeForm()

  return (
    <div className="w-full max-w-full px-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Basic Information</h1>
        <p className="text-[#f1eece]/80">Let's start with your personal details</p>
      </div>

      <div className="space-y-6 w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-[rgba(30,30,35,0.5)] flex items-center justify-center overflow-hidden mb-4 border-4 border-[#131318] shadow-lg">
            {previewUrl ? (
              <img src={previewUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-[#f1eece]/40" />
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("profile-upload")?.click()}
            className="mt-2 border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
          >
            Upload Photo
          </Button>
          <input id="profile-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#f1eece]">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                <User size={18} />
              </div>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="pl-10 w-full bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                value={formData.basicInfo.name}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#f1eece]">
              Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 w-full bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                value={formData.basicInfo.email}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#f1eece]">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                <Phone size={18} />
              </div>
              <Input
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                className="pl-10 w-full bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                value={formData.basicInfo.phone}
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}