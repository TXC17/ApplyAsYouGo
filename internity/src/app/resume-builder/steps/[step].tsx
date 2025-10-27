"use client"

import type React from "react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Briefcase,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define types for our form data
interface BasicInfo {
  name: string
  email: string
  phone: string
}

interface Education {
  degree: string
  institution: string
  year: string
  id: string
}

interface Experience {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
  id: string
}

interface FormData {
  basicInfo: BasicInfo
  education: Education[]
  experience: Experience[]
  skills: string[]
}

// Initial form data
const initialFormData: FormData = {
  basicInfo: {
    name: "",
    email: "",
    phone: "",
  },
  education: [
    {
      degree: "",
      institution: "",
      year: "",
      id: "edu-1",
    },
  ],
  experience: [
    {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      id: "exp-1",
    },
  ],
  skills: [],
}

// Available skills for selection
const availableSkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "HTML",
  "CSS",
  "SQL",
  "NoSQL",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Git",
  "Agile",
  "Scrum",
  "Project Management",
  "UI/UX Design",
  "Figma",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Teamwork",
]

export default function ResumeBuilderStep({ params }: { params: { step: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [step, setStep] = useState(1)

  // Parse the step from the URL
  useEffect(() => {
    const stepNumber = Number.parseInt(params.step)
    if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= 5) {
      setStep(stepNumber)
    } else {
      // If the step is invalid, redirect to step 1
      router.replace("/resume-builder/steps/1")
    }
  }, [params.step, router])

  // Load form data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem("resumeFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData)
      } catch (error) {
        console.error("Error parsing saved form data:", error)
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData))
  }, [formData])

  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      basicInfo: {
        ...formData.basicInfo,
        [name]: value,
      },
    })
  }

  // Handle education changes
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...formData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      education: updatedEducation,
    })
  }

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          year: "",
          id: `edu-${Date.now()}`,
        },
      ],
    })
  }

  // Remove education entry
  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const updatedEducation = [...formData.education]
      updatedEducation.splice(index, 1)
      setFormData({
        ...formData,
        education: updatedEducation,
      })
    }
  }

  // Handle experience changes
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...formData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      experience: updatedExperience,
    })
  }

  // Add new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
          id: `exp-${Date.now()}`,
        },
      ],
    })
  }

  // Remove experience entry
  const removeExperience = (index: number) => {
    if (formData.experience.length > 1) {
      const updatedExperience = [...formData.experience]
      updatedExperience.splice(index, 1)
      setFormData({
        ...formData,
        experience: updatedExperience,
      })
    }
  }

  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      })
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      })
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (step < 5) {
      const nextStepNumber = step + 1
      // Save current state before navigating
      localStorage.setItem("resumeFormData", JSON.stringify(formData))
      router.push(`/resume-builder/steps/${nextStepNumber}`)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (step > 1) {
      const prevStepNumber = step - 1
      // Save current state before navigating
      localStorage.setItem("resumeFormData", JSON.stringify(formData))
      router.push(`/resume-builder/steps/${prevStepNumber}`)
    } else {
      router.push("/resume-builder")
    }
  }

  // Generate PDF (mock function)
  const generatePDF = () => {
    toast.success("In a real application, this would generate a PDF of your resume.")
    // This would typically call a PDF generation library or API
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {["Basic Info", "Education", "Experience", "Skills", "Review"].map((label, index) => (
              <div
                key={index}
                className={`text-sm font-medium ${step >= index + 1 ? "text-purple-600" : "text-gray-400"}`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="backdrop-blur-md bg-white/70 border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8"
            >
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Basic Information</h1>
                    <p className="text-gray-600">Let's start with your personal details</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">
                          Full Name
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <User size={18} />
                          </div>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            className="pl-10"
                            value={formData.basicInfo.name}
                            onChange={handleBasicInfoChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <Mail size={18} />
                          </div>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            value={formData.basicInfo.email}
                            onChange={handleBasicInfoChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <Phone size={18} />
                          </div>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="(123) 456-7890"
                            className="pl-10"
                            value={formData.basicInfo.phone}
                            onChange={handleBasicInfoChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Education</h1>
                    <p className="text-gray-600">Add your educational background</p>
                  </div>

                  <div className="space-y-6">
                    {formData.education.map((edu, index) => (
                      <div key={edu.id} className="p-6 border border-gray-200 rounded-lg bg-white/80 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Education #{index + 1}</h3>
                          {formData.education.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${index}`} className="text-gray-700">
                              Degree
                            </Label>
                            <Select
                              value={edu.degree}
                              onValueChange={(value) => handleEducationChange(index, "degree", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select degree" />
                              </SelectTrigger>
                              <SelectContent>
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
                            <Label htmlFor={`institution-${index}`} className="text-gray-700">
                              Institution
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Building size={18} />
                              </div>
                              <Input
                                id={`institution-${index}`}
                                placeholder="University or School Name"
                                className="pl-10"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`year-${index}`} className="text-gray-700">
                              Graduation Year
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Calendar size={18} />
                              </div>
                              <Input
                                id={`year-${index}`}
                                placeholder="2023"
                                className="pl-10"
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
                      className="w-full py-2 border-dashed"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Education
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Work Experience */}
              {step === 3 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Work Experience</h1>
                    <p className="text-gray-600">Add your professional experience</p>
                  </div>

                  <div className="space-y-6">
                    {formData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-6 border border-gray-200 rounded-lg bg-white/80 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Experience #{index + 1}</h3>
                          {formData.experience.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`title-${index}`} className="text-gray-700">
                              Job Title
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Briefcase size={18} />
                              </div>
                              <Input
                                id={`title-${index}`}
                                placeholder="Software Engineer"
                                className="pl-10"
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(index, "title", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`company-${index}`} className="text-gray-700">
                              Company
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                <Building size={18} />
                              </div>
                              <Input
                                id={`company-${index}`}
                                placeholder="Company Name"
                                className="pl-10"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${index}`} className="text-gray-700">
                                Start Date
                              </Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                  <Calendar size={18} />
                                </div>
                                <Input
                                  id={`startDate-${index}`}
                                  placeholder="MM/YYYY"
                                  className="pl-10"
                                  value={exp.startDate}
                                  onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${index}`} className="text-gray-700">
                                End Date
                              </Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                  <Calendar size={18} />
                                </div>
                                <Input
                                  id={`endDate-${index}`}
                                  placeholder="MM/YYYY or Present"
                                  className="pl-10"
                                  value={exp.endDate}
                                  onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${index}`} className="text-gray-700">
                              Description
                            </Label>
                            <Textarea
                              id={`description-${index}`}
                              placeholder="Describe your responsibilities and achievements..."
                              className="min-h-[100px]"
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
                      className="w-full py-2 border-dashed"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Another Experience
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Skills */}
              {step === 4 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Skills</h1>
                    <p className="text-gray-600">Select the skills that best represent you</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Review Your Resume</h1>
                    <p className="text-gray-600">Here's a preview of your resume</p>
                  </div>

                  <div className="space-y-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                    {/* Basic Info Preview */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{formData.basicInfo.name || "Your Name"}</h2>
                        <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
                          {formData.basicInfo.email && (
                            <div className="flex items-center">
                              <Mail size={14} className="mr-1" />
                              {formData.basicInfo.email}
                            </div>
                          )}
                          {formData.basicInfo.phone && (
                            <div className="flex items-center">
                              <Phone size={14} className="mr-1" />
                              {formData.basicInfo.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Education Preview */}
                    {formData.education.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Education</h3>
                        {formData.education.map((edu, index) => (
                          <div key={edu.id} className="space-y-1">
                            <div className="font-medium">{edu.degree || "Degree"}</div>
                            <div className="text-gray-600">{edu.institution || "Institution"}</div>
                            <div className="text-gray-500 text-sm">{edu.year || "Year"}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience Preview */}
                    {formData.experience.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Experience</h3>
                        {formData.experience.map((exp, index) => (
                          <div key={exp.id} className="space-y-2">
                            <div className="font-medium">{exp.title || "Job Title"}</div>
                            <div className="text-gray-600">{exp.company || "Company"}</div>
                            <div className="text-gray-500 text-sm">
                              {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                            </div>
                            <p className="text-gray-700 text-sm">{exp.description || "Job description..."}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills Preview */}
                    {formData.skills.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={generatePDF}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-6 rounded-lg transition-all duration-300"
                    >
                      <Download size={16} className="mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className={step === 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </Button>

                {step < 5 && (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}

