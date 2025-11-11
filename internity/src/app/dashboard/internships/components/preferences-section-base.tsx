"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, ChevronUp, ChevronDown, Save } from "lucide-react"

export interface PreferencesData {
  keywords: string
  maxApplications: number
  maxPages: number
}

interface PreferencesSectionProps {
  onSave: (preferences: PreferencesData) => void
  title?: string
}

export function PreferencesSectionBase({ onSave, title = "Application Preferences" }: PreferencesSectionProps) {
  const [preferencesOpen, setPreferencesOpen] = useState(true)
  const [keywords, setKeywords] = useState("web-development")
  const [maxApplications, setMaxApplications] = useState(20)
  const [maxPages, setMaxPages] = useState(2)

  const keywordOptions = [
    "web-development",
    "backend-development",
    "front-end-development",
    "machine-learning",
    "data-science",
    "devops",
    "ui-ux-design",
    "blockchain"
  ];
  
  
  // Handle saving application preferences
  const handleSavePreferences = () => {
    // Call the onSave callback with the current preferences
    onSave({ keywords, maxApplications, maxPages })
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
              {title}
            </h2>
            <Button variant="ghost" className="p-0 h-auto text-[#f1eece]">
              {preferencesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-[#f1eece]">
                Keywords
              </Label>
              <Select value={keywords} onValueChange={setKeywords}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select keywords" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  {keywordOptions.map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxApplications" className="text-[#f1eece]">
                Max Applications
              </Label>
              <Select value={maxApplications.toString()} onValueChange={(val) => setMaxApplications(Number(val))}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select max applications" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPages" className="text-[#f1eece]">
                Max Pages
              </Label>
              <Select value={maxPages.toString()} onValueChange={(val) => setMaxPages(Number(val))}>
                <SelectTrigger className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectValue placeholder="Select max pages" />
                </SelectTrigger>
                <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
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
