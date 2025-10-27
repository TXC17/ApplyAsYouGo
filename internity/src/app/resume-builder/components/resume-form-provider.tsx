"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for our form data
export interface BasicInfo {
  name: string
  email: string
  phone: string
  profilePicture: File | null
}

export interface Education {
  degree: string
  institution: string
  year: string
  id: string
}

export interface Experience {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
  id: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
}

export interface FormData {
  basicInfo: BasicInfo
  education: Education[]
  experience: Experience[]
  skills: string[]
  projects: Project[]
}

// Initial form data
export const initialFormData: FormData = {
  basicInfo: {
    name: "",
    email: "",
    phone: "",
    profilePicture: null,
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
  projects: [
    {
      id: "proj-1",
      title: "",
      description: "",
      technologies: [],
    },
  ],
}

// Available skills for selection
export const availableSkills = [
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

// Available technologies for projects
export const availableTechnologies = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "GraphQL",
  "REST API",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Firebase",
  "Vercel",
  "Netlify",
  "Heroku",
  "GitHub Actions",
  "Jenkins",
  "CircleCI",
  "Webpack",
  "Vite",
  "Tailwind CSS",
  "Material UI",
  "Bootstrap",
  "SASS/SCSS",
  "Redux",
  "MobX",
  "Zustand",
  "React Query",
  "SWR",
  "Jest",
  "Cypress",
  "Playwright",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Swift",
  "Kotlin",
]

interface ResumeFormContextType {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  previewUrl: string | null
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  saveFormData: () => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleEducationChange: (index: number, field: keyof Education, value: string) => void
  addEducation: () => void
  removeEducation: (index: number) => void
  handleExperienceChange: (index: number, field: keyof Experience, value: string) => void
  addExperience: () => void
  removeExperience: (index: number) => void
  toggleSkill: (skill: string) => void
  addCustomSkill: (skill: string) => void
  handleProjectChange: (index: number, field: keyof Omit<Project, "technologies">, value: string) => void
  toggleProjectTechnology: (index: number, technology: string) => void
  addProject: () => void
  removeProject: (index: number) => void
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  fetchResumeFromBackend: () => Promise<void>
  saveResumeToBackend: () => Promise<void>
  generateAIResume: () => Promise<void>
  isGenerating: boolean
  generateResumeWithTemplate: () => string
}

const ResumeFormContext = createContext<ResumeFormContextType | undefined>(undefined)

export function ResumeFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load form data from localStorage if available (only on initial load)
  useEffect(() => {
    const savedData = localStorage.getItem("resumeFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // We need to handle the File object separately since it can't be serialized
        setFormData({
          ...parsedData,
          basicInfo: {
            ...parsedData.basicInfo,
            profilePicture: null,
          },
          // Ensure projects array exists (for backward compatibility)
          projects: parsedData.projects || initialFormData.projects,
        })

        // Restore preview URL if it exists
        const savedPreviewUrl = localStorage.getItem("profilePicturePreview")
        if (savedPreviewUrl) {
          setPreviewUrl(savedPreviewUrl)
        }
      } catch (error) {
        console.error("Error parsing saved form data:", error)
      }
    }
  }, [])

  // Save form data to localStorage
  const saveFormData = () => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData))

    // Save preview URL separately
    if (previewUrl) {
      localStorage.setItem("profilePicturePreview", previewUrl)
    }
  }

  // Handle file upload for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFormData({
        ...formData,
        basicInfo: {
          ...formData.basicInfo,
          profilePicture: file,
        },
      })

      // Create a preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

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

  // Add custom skill
  const addCustomSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      })
    }
  }

  // Handle project changes
  const handleProjectChange = (index: number, field: keyof Omit<Project, "technologies">, value: string) => {
    const updatedProjects = [...formData.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      projects: updatedProjects,
    })
  }

  // Toggle project technology
  const toggleProjectTechnology = (index: number, technology: string) => {
    const updatedProjects = [...formData.projects]
    const project = updatedProjects[index]

    if (project.technologies.includes(technology)) {
      project.technologies = project.technologies.filter((tech) => tech !== technology)
    } else {
      project.technologies = [...project.technologies, technology]
    }

    setFormData({
      ...formData,
      projects: updatedProjects,
    })
  }

  // Add new project
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          id: `proj-${Date.now()}`,
          title: "",
          description: "",
          technologies: [],
        },
      ],
    })
  }

  // Remove project
  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      const updatedProjects = [...formData.projects]
      updatedProjects.splice(index, 1)
      setFormData({
        ...formData,
        projects: updatedProjects,
      })
    }
  }

  // Simulate fetching resume from backend
  const fetchResumeFromBackend = async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would fetch data from an API
    // For now, we'll just use the current formData
    setIsLoading(false)

    // Return the current data (in a real app, this would be the response from the API)
    return
  }

  // Simulate saving resume to backend
  const saveResumeToBackend = async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would send data to an API
    console.log("Saving resume data to backend:", formData)

    setIsLoading(false)
    return
  }

  // Simulate AI resume generation
  const generateAIResume = async () => {
    setIsGenerating(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // In a real app, you would call an AI service
    // For now, we'll just enhance the current data with some placeholder improvements

    // Example: Enhance job descriptions if they're empty
    const enhancedExperience = formData.experience.map((exp) => {
      if (!exp.description || exp.description.trim() === "") {
        return {
          ...exp,
          description: `As a ${exp.title} at ${exp.company}, I contributed to key projects, improved processes, and collaborated with cross-functional teams to deliver high-quality results.`,
        }
      }
      return exp
    })

    // Example: Add some common skills if skills array is empty
    let enhancedSkills = [...formData.skills]
    if (enhancedSkills.length === 0) {
      enhancedSkills = ["Communication", "Teamwork", "Problem Solving", "Time Management"]
    }

    setFormData({
      ...formData,
      experience: enhancedExperience,
      skills: enhancedSkills,
    })

    setIsGenerating(false)
    return
  }

  const generateResumeWithTemplate = () => {
    const { basicInfo, education, experience, skills, projects } = formData

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.2;
              max-width: 800px;
              margin: 0 auto;
              padding: 1rem;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 1rem;
            }
            .header h1 {
              font-size: 24pt;
              margin-bottom: 0.5rem;
              text-transform: uppercase;
            }
            .contact-info {
              font-size: 10pt;
              margin-bottom: 1rem;
            }
            .section-title {
              font-size: 12pt;
              text-transform: uppercase;
              border-bottom: 1px solid black;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              font-weight: bold;
            }
            .entry {
              margin-bottom: 0.75rem;
              position: relative;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
            }
            .entry-title {
              font-weight: bold;
              font-style: italic;
            }
            .entry-subtitle {
              font-style: italic;
            }
            .entry-date {
              text-align: right;
            }
            .entry-location {
              text-align: right;
            }
            ul {
              margin-top: 0.25rem;
              margin-bottom: 0.25rem;
              padding-left: 1.5rem;
            }
            li {
              margin-bottom: 0.25rem;
              font-size: 10pt;
            }
            .skills-section {
              margin-bottom: 0.5rem;
            }
            .skills-category {
              font-weight: bold;
            }
            a {
              color: #000;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${basicInfo.name}</h1>
            <div class="contact-info">
              ${basicInfo.phone} | <a href="mailto:${basicInfo.email}">${basicInfo.email}</a>
            </div>
          </div>

          <div class="section-title">Education</div>
          ${education
            .map(
              (edu) => `
              <div class="entry">
                <div class="entry-header">
                  <div class="entry-title">${edu.institution}</div>
                  <div class="entry-location">${edu.year.includes("-") ? edu.year : `${edu.year}`}</div>
                </div>
                <div class="entry-subtitle">${edu.degree}</div>
              </div>
            `,
            )
            .join("")}

          <div class="section-title">Experience</div>
          ${experience
            .map(
              (exp) => `
              <div class="entry">
                <div class="entry-header">
                  <div class="entry-title">${exp.title}</div>
                  <div class="entry-date">${exp.startDate} - ${exp.endDate}</div>
                </div>
                <div class="entry-header">
                  <div class="entry-subtitle">${exp.company}</div>
                  <div class="entry-location"></div>
                </div>
                <ul>
                  ${exp.description
                    .split("\n")
                    .map((line) => `<li>${line}</li>`)
                    .join("")}
                </ul>
              </div>
            `,
            )
            .join("")}

          <div class="section-title">Projects</div>
          ${projects
            .map(
              (proj) => `
              <div class="entry">
                <div class="entry-header">
                  <div class="entry-title">${proj.title}</div>
                  <div class="entry-date"></div>
                </div>
                <ul>
                  <li>${proj.description}</li>
                  ${proj.technologies.length > 0 ? `<li>Technologies: ${proj.technologies.join(", ")}</li>` : ""}
                </ul>
              </div>
            `,
            )
            .join("")}

          <div class="section-title">Technical Skills</div>
          <div class="skills-section">
            <span class="skills-category">Skills:</span> ${skills.join(", ")}
          </div>
        </body>
      </html>
    `
  }

  return (
    <ResumeFormContext.Provider
      value={{
        formData,
        setFormData,
        previewUrl,
        setPreviewUrl,
        saveFormData,
        handleFileChange,
        handleBasicInfoChange,
        handleEducationChange,
        addEducation,
        removeEducation,
        handleExperienceChange,
        addExperience,
        removeExperience,
        toggleSkill,
        addCustomSkill,
        handleProjectChange,
        toggleProjectTechnology,
        addProject,
        removeProject,
        isLoading,
        setIsLoading,
        isEditing,
        setIsEditing,
        fetchResumeFromBackend,
        saveResumeToBackend,
        generateAIResume,
        isGenerating,
        generateResumeWithTemplate,
      }}
    >
      {children}
    </ResumeFormContext.Provider>
  )
}

export function useResumeForm() {
  const context = useContext(ResumeFormContext)
  if (context === undefined) {
    throw new Error("useResumeForm must be used within a ResumeFormProvider")
  }
  return context
}
