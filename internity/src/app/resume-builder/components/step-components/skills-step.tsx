"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, X } from "lucide-react"
import { useResumeForm, availableSkills } from "../../components/resume-form-context"

export default function SkillsStepContent() {
  const { formData, toggleSkill, addCustomSkill } = useResumeForm()
  const [customSkill, setCustomSkill] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      addCustomSkill(customSkill.trim())
      setCustomSkill("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomSkill()
    }
  }

  // Filter skills based on search query
  const filteredSkills = availableSkills.filter((skill) => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#131318] rounded-lg p-8 w-full h-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Skills</h1>
        <p className="text-[#f1eece]/80">Select the skills that best represent you</p>
      </div>

      <div className="space-y-6">
        {/* Custom skill input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a custom skill..."
              className="bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
            />
          </div>
          <Button onClick={handleAddCustomSkill} className="bg-[#f1eece] text-[#131318] hover:bg-[#f1eece]/80 h-12">
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f1eece]/50" size={16} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#f1eece]/50 hover:text-[#f1eece]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Selected skills */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#f1eece]/80 mb-3">Selected Skills</h3>
          <div className="flex flex-wrap gap-2">
            {formData.skills.length > 0 ? (
              formData.skills.map((skill) => (
                <div
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className="px-3 py-1.5 bg-[#f1eece] text-[#131318] rounded-full text-sm font-medium cursor-pointer flex items-center gap-1 hover:bg-[#f1eece]/80 transition-colors"
                >
                  {skill}
                  <X size={14} className="ml-1" />
                </div>
              ))
            ) : (
              <p className="text-[#f1eece]/50 text-sm">No skills selected yet</p>
            )}
          </div>
        </div>

        {/* Available skills */}
        <div>
          <h3 className="text-sm font-medium text-[#f1eece]/80 mb-3">Available Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
                <div
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-3 rounded-md text-sm cursor-pointer transition-all flex items-center ${
                    formData.skills.includes(skill)
                      ? "bg-[#f1eece] text-[#131318] shadow-md"
                      : "bg-[rgba(30,30,35,0.5)] text-[#f1eece]/70 border border-transparent hover:border-[#f1eece]/20 hover:bg-[rgba(40,40,45,0.5)]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md mr-2 flex items-center justify-center ${
                      formData.skills.includes(skill) ? "bg-[#131318] text-[#f1eece]" : "border border-[#f1eece]/30"
                    }`}
                  >
                    {formData.skills.includes(skill) && <Check size={12} />}
                  </div>
                  <span className="font-medium">{skill}</span>
                </div>
              ))
            ) : (
              <p className="text-[#f1eece]/50 text-sm col-span-3">No matching skills found</p>
            )}
          </div>
        </div>
      </div>

      {/* <div className="mt-10 flex justify-between">
        <Button variant="outline" className="border-[#f1eece]/30 text-[#f1eece] hover:bg-[rgba(30,30,35,0.5)]">
          <span className="mr-2">←</span> Previous
        </Button>
        <Button className="bg-[#f1eece] text-[#131318] hover:bg-[#f1eece]/80">
          Next <span className="ml-2">→</span>
        </Button>
      </div> */}
    </div>
  )
}

function Check({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}