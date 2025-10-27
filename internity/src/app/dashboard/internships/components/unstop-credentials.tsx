"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Lock, ChevronUp, ChevronDown, Save, Shield } from "lucide-react"
import { toast } from "sonner"
export function UnstopCredentials() {
  const [credentialsOpen, setCredentialsOpen] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })

  // Handle credential input changes
  const handleCredentialChange = (field: string, value: string) => {
    setCredentials({
      ...credentials,
      [field]: value,
    })
  }

  // Handle saving platform credentials
  const handleSaveCredentials = () => {
    // In a real app, this would save the credentials to the database
    console.log("Saving Unstop credentials:", credentials)
    toast.success("Unstop credentials saved successfully!")
  }

  return (
    <Collapsible
      open={credentialsOpen}
      onOpenChange={setCredentialsOpen}
      className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden"
    >
      <div className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-2xl font-bold text-[#f1eece] flex items-center">
              <Lock size={20} className="mr-2" />
              Unstop Credentials
            </h2>
            <Button variant="ghost" className="p-0 h-auto text-[#f1eece]">
              {credentialsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-6 space-y-6">
          {/* Unstop Credentials */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unstop-email" className="text-[#f1eece]">
                  Unstop Email
                </Label>
                <Input
                  id="unstop-email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                  value={credentials.email}
                  onChange={(e) => handleCredentialChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unstop-password" className="text-[#f1eece]">
                  Unstop Password
                </Label>
                <Input
                  id="unstop-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                  value={credentials.password}
                  onChange={(e) => handleCredentialChange("password", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-[rgba(30,30,35,0.5)] p-4 rounded-lg text-[#f1eece]/70 text-sm flex items-start space-x-2">
            <Shield className="h-5 w-5 text-[#a90519] mt-0.5 flex-shrink-0" />
            <p>
              These credentials are securely stored and used only to apply on your behalf. Your data is encrypted and
              never shared with third parties.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSaveCredentials}
              className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
            >
              <Save size={16} className="mr-2" />
              Save Credentials
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
