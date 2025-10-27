"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Code } from "lucide-react"
import { useResumeForm, availableTechnologies } from "../../components/resume-form-context"

export default function ProjectsStepContent() {
  const { formData, handleProjectChange, toggleProjectTechnology, addProject, removeProject } = useResumeForm()

  return (
    <div className="bg-[#131318] rounded-lg p-8 w-full h-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Projects</h1>
        <p className="text-[#f1eece]/80">Add your notable projects and the technologies you used</p>
      </div>

      <div className="space-y-6">
        {formData.projects.map((project, index) => (
          <div key={project.id} className="p-6 border border-[#f1eece]/20 rounded-lg bg-[rgba(30,30,35,0.5)] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#f1eece]">Project #{index + 1}</h3>
              {formData.projects.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`project-title-${index}`} className="text-[#f1eece]">
                  Project Title
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#f1eece]/50">
                    <Code size={18} />
                  </div>
                  <Input
                    id={`project-title-${index}`}
                    placeholder="E-commerce Website"
                    className="pl-10 bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50 h-12"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-description-${index}`} className="text-[#f1eece]">
                  Project Description
                </Label>
                <Textarea
                  id={`project-description-${index}`}
                  placeholder="Describe your project, its purpose, and your role..."
                  className="min-h-[120px] bg-[rgba(30,30,35,0.5)] border-[#f1eece]/30 text-[#f1eece] placeholder:text-[#f1eece]/50"
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#f1eece]">Technologies Used</Label>
                <div className="border border-[#f1eece]/20 rounded-md p-4 bg-[rgba(25,25,30,0.7)]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableTechnologies.map((tech) => (
                      <div 
                        key={tech} 
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-[rgba(40,40,45,0.5)] transition-colors cursor-pointer"
                        onClick={() => toggleProjectTechnology(index, tech)}
                      >
                        <Checkbox
                          id={`tech-${index}-${tech}`}
                          checked={project.technologies.includes(tech)}
                          className="border-[#f1eece]/30 data-[state=checked]:bg-[#f1eece] data-[state=checked]:text-[#131318]"
                        />
                        <Label htmlFor={`tech-${index}-${tech}`} className="text-sm font-medium text-[#f1eece]/80 cursor-pointer">
                          {tech}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="w-full py-3 border-dashed border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Another Project
        </Button>
      </div>

      
    </div>
  )
}