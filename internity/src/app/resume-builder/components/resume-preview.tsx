"use client"

import { Mail, Phone, Calendar, Briefcase, GraduationCap, Code } from "lucide-react"
import type { FormData } from "./resume-form-context"

interface ResumePreviewProps {
  formData: FormData
}

export default function ResumePreview({ formData }: ResumePreviewProps) {
  const { basicInfo, education, experience, skills, projects } = formData

  return (
    <div className="p-8 bg-white text-black font-sans">
      {/* Header */}
      <header className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-center">{basicInfo.name || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
          {basicInfo.email && (
            <div className="flex items-center">
              <Mail size={14} className="mr-1" />
              {basicInfo.email}
            </div>
          )}
          {basicInfo.phone && (
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              {basicInfo.phone}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Education Section */}
          {education.length > 0 && education.some((edu) => edu.degree || edu.institution) && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3 flex items-center">
                <GraduationCap size={18} className="mr-2" />
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) =>
                  edu.degree || edu.institution ? (
                    <div key={edu.id} className="space-y-1">
                      <div className="font-bold">{edu.degree || "Degree"}</div>
                      <div className="font-medium">{edu.institution || "Institution"}</div>
                      {edu.year && (
                        <div className="text-gray-600 text-sm flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {edu.year}
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Projects Section */}
          {projects.length > 0 && projects.some((proj) => proj.title || proj.description || proj.technologies.length > 0) && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3 flex items-center">
                <Code size={18} className="mr-2" />
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) =>
                  (project.title || project.description || project.technologies.length > 0) ? (
                    <div key={project.id} className="space-y-1">
                      {project.title && <div className="font-bold">{project.title}</div>}
                      {project.description && <p className="text-sm">{project.description}</p>}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {experience.length > 0 && experience.some((exp) => exp.title || exp.company) && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3 flex items-center">
                <Briefcase size={18} className="mr-2" />
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) =>
                  exp.title || exp.company ? (
                    <div key={exp.id} className="space-y-1">
                      <div className="font-bold">{exp.title || "Job Title"}</div>
                      <div className="flex justify-between">
                        <div className="font-medium">{exp.company || "Company"}</div>
                        <div className="text-gray-600 text-sm flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {exp.startDate || "Start Date"} - {exp.endDate || "Present"}
                        </div>
                      </div>
                      {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                    </div>
                  ) : null,
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
