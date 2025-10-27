"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Briefcase, Building, Calendar, Plus, Trash2 } from "lucide-react"
import { useResumeForm } from "../../components/resume-form-context"

export default function ExperienceStepContent() {
  const { formData, handleExperienceChange, addExperience, removeExperience } = useResumeForm()

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Work Experience</h1>
        <p className="text-[#f1eece]/80">Add your professional experience</p>
      </div>

      <div className="space-y-6">
        {formData.experience.map((exp, index) => (
          <div key={exp.id} className="p-6 border border-[#f1eece]/20 rounded-lg bg-[rgba(30,30,35,0.5)] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#f1eece]">Experience #{index + 1}</h3>
              {formData.experience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`} className="text-[#f1eece]">
                  Job Title
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                    <Briefcase size={18} />
                  </div>
                  <Input
                    id={`title-${index}`}
                    placeholder="Software Engineer"
                    className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`company-${index}`} className="text-[#f1eece]">
                  Company
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                    <Building size={18} />
                  </div>
                  <Input
                    id={`company-${index}`}
                    placeholder="Company Name"
                    className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${index}`} className="text-[#f1eece]">
                    Start Date
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                      <Calendar size={18} />
                    </div>
                    <Input
                      id={`startDate-${index}`}
                      placeholder="MM/YYYY"
                      className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`endDate-${index}`} className="text-[#f1eece]">
                    End Date
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                      <Calendar size={18} />
                    </div>
                    <Input
                      id={`endDate-${index}`}
                      placeholder="MM/YYYY or Present"
                      className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`} className="text-[#f1eece]">
                  Description
                </Label>
                <Textarea
                  id={`description-${index}`}
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[100px] bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="w-full py-2 border-dashed border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
        >
          <Plus size={16} className="mr-2" />
          Add Another Experience
        </Button>
      </div>
    </>
  )
}

