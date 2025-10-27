"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Save, Loader2, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResumeForm } from "../../components/resume-form-context"
import BasicInfoStepContent from "./basic-info-step"
import EducationStepContent from "./education-step"
import ExperienceStepContent from "./experience-step"
import SkillsStepContent from "./skills-step"
import ProjectsStepContent from "./projects-step"
import ResumePreview from "../resume-preview"

export default function ReviewStepContent() {
  const {
    formData,
    isLoading,
    isEditing,
    setIsEditing,
    fetchResumeFromBackend,
    saveResumeToBackend,
    generateAIResume,
    isGenerating,
  } = useResumeForm()

  // Fetch resume data when component mounts
  useEffect(() => {
    fetchResumeFromBackend()
  }, [])

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveChanges = async () => {
    await saveResumeToBackend()
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-[#f1eece] mx-auto mb-4" />
        <p className="text-lg text-[#f1eece]/80">Loading your resume...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Review Your Resume</h1>
          <p className="text-[#f1eece]/80">Here's a preview of your resume</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateAIResume}
            variant="outline"
            className="flex items-center gap-2 border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>AI Enhance</span>
              </>
            )}
          </Button>
          <Button
            onClick={toggleEditMode}
            variant="outline"
            className="flex items-center gap-2 border-[#f1eece]/30 text-[#f1eece] hover:bg-[#f1eece]/10"
          >
            {isEditing ? (
              <>
                <Save size={16} />
                <span>View Mode</span>
              </>
            ) : (
              <>
                <Edit size={16} />
                <span>Edit Mode</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-8">
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6 bg-[rgba(30,30,35,0.5)]">
              <TabsTrigger
                value="basic-info"
                className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
              >
                Education
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
              >
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
              >
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info">
              <BasicInfoStepContent />
            </TabsContent>

            <TabsContent value="education">
              <EducationStepContent />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceStepContent />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsStepContent />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsStepContent />
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Button onClick={handleSaveChanges} className="bg-[#f1eece] text-[#131318] hover:bg-[#f1eece]/80">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="border border-[#f1eece]/20 rounded-lg bg-[rgba(25,25,30,0.7)] shadow-sm overflow-hidden">
            <ResumePreview formData={formData} />
          </div>
        </div>
      )}
    </>
  )
}

