"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Download, Edit, Trash2, MoreHorizontal, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface ResumeListProps {
  limit?: number
}

export default function ResumeList({ limit }: ResumeListProps) {
  const router = useRouter()
  const [resumes] = useState([
    {
      id: "1",
      title: "Software Developer Resume",
      lastUpdated: "2 days ago",
      status: "Complete",
      template: "Professional",
      downloads: 12,
    },
    {
      id: "2",
      title: "UX Designer Portfolio",
      lastUpdated: "1 week ago",
      status: "Complete",
      template: "Creative",
      downloads: 8,
    },
    {
      id: "3",
      title: "Project Manager CV",
      lastUpdated: "2 weeks ago",
      status: "Complete",
      template: "Executive",
      downloads: 5,
    },
    {
      id: "4",
      title: "Marketing Specialist Resume",
      lastUpdated: "1 month ago",
      status: "Draft",
      template: "Modern",
      downloads: 0,
    },
    {
      id: "5",
      title: "Data Analyst Resume",
      lastUpdated: "1 month ago",
      status: "In Progress",
      template: "Minimal",
      downloads: 0,
    },
  ])

  const displayedResumes = limit ? resumes.slice(0, limit) : resumes

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      case "Draft":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {displayedResumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{resume.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Updated {resume.lastUpdated}</span>
                  <Badge className={getStatusColor(resume.status)}>{resume.status}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resume.status === "Complete" && (
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Download size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500"
                onClick={() => router.push(`/resume-builder/steps/1?id=${resume.id}`)}
              >
                <Edit size={16} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}

      {limit && resumes.length > limit && (
        <Button variant="outline" className="w-full mt-2" onClick={() => router.push("/dashboard?tab=resumes")}>
          View All Resumes
        </Button>
      )}

      {displayedResumes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No resumes found</p>
          <Button
            className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            onClick={() => router.push("/resume-builder")}
          >
            Create New Resume
          </Button>
        </div>
      )}
    </div>
  )
}

