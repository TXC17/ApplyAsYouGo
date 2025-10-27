"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building, Calendar, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useResumeForm } from "../../components/resume-form-context"

export default function EducationStepContent() {
  const { formData, handleEducationChange, addEducation, removeEducation } = useResumeForm()

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Education</h1>
        <p className="text-[#f1eece]/80">Add your educational background</p>
      </div>

      <div className="space-y-6">
        {formData.education.map((edu, index) => (
          <div key={edu.id} className="p-6 border border-[#f1eece]/20 rounded-lg bg-[rgba(30,30,35,0.5)] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#f1eece]">Education #{index + 1}</h3>
              {formData.education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`} className="text-[#f1eece]">
                  Degree
                </Label>
                <Select value={edu.degree} onValueChange={(value) => handleEducationChange(index, "degree", value)}>
                  <SelectTrigger className="bg-[rgba(25,25,30,0.7)] border-[#f1eece]/30 text-[#f1eece]">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131318] border-[#f1eece]/30 text-[#f1eece]">
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate's">Associate's Degree</SelectItem>
                    <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`} className="text-[#f1eece]">
                  Institution
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                    <Building size={18} />
                  </div>
                  <Input
                    id={`institution-${index}`}
                    placeholder="University or School Name"
                    className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`year-${index}`} className="text-[#f1eece]">
                  Graduation Year
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                    <Calendar size={18} />
                  </div>
                  <Input
                    id={`year-${index}`}
                    placeholder="2023"
                    className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full py-2 border-dashed border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
        >
          <Plus size={16} className="mr-2" />
          Add Another Education
        </Button>
      </div>
    </>
  )
}

