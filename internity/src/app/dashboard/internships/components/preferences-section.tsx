"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Filter, ChevronUp, ChevronDown, Save } from "lucide-react"
import { toast } from "sonner"
export function PreferencesSection() {
  const [preferencesOpen, setPreferencesOpen] = useState(true)
  const [category, setCategory] = useState("")
  const [userType, setUserType] = useState("fresher")
  const [passingYear, setPassingYear] = useState("2026")
  const [quickApply, setQuickApply] = useState(true)

  const categoryOptions = [
  "backend-development",
  "devops-cloud",
  "frontend-development",
  "Full-Stack-Development",
  "machine-learning",
  "data-science-machine-learning",
  "ui-ux",
  "blockchain"  // Newly added
  ]
  

  // Handle saving application preferences
  const handleSavePreferences = () => {
    // In a real app, this would save the preferences to the database
    console.log("Saving preferences:", { category, userType, passingYear, quickApply })
    toast.success("Application preferences saved successfully!")
  }

  return (
    <Collapsible
      open={preferencesOpen}
      onOpenChange={setPreferencesOpen}
      className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden mb-6"
    >
      <div className="p-6">
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer">
            <h2 className="text-2xl font-bold text-[#f1eece] flex items-center">
              <Filter size={20} className="mr-2" />
              Application Preferences
            </h2>
            <Button variant="ghost" className="p-0 h-auto text-[#f1eece]">
              {preferencesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-[#f1eece]">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, "_")}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            <div className="space-y-2">
              <Label htmlFor="userType" className="text-[#f1eece]">
                User Type
              </Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="experienced">Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingYear" className="text-[#f1eece]">
                Passing Year
              </Label>
              <Select value={passingYear} onValueChange={setPassingYear}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select passing year" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quickApply" className="text-[#f1eece]">
                Quick Apply
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="quickApply"
                  checked={quickApply}
                  onCheckedChange={setQuickApply}
                  className="data-[state=checked]:bg-[#a90519]"
                />
                <Label htmlFor="quickApply" className="text-[#f1eece]/70">
                  {quickApply ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSavePreferences}
              className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}