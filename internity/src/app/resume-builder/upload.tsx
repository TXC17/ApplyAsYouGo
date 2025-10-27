"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/msword" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile)
      } else {
        toast.success("Please upload a PDF or Word document")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleNext = () => {
    // In a real app, you would process the file here
    // Save file information to localStorage or your state management solution
    localStorage.setItem(
      "uploadedResume",
      JSON.stringify({
        name: file?.name,
        size: file?.size,
        type: file?.type,
        lastModified: file?.lastModified,
      }),
    )

    router.push("/resume-builder/steps/1")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <Card className="w-full max-w-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Your Resume</h1>
          <p className="text-gray-600">Upload your existing resume and we'll help you enhance it</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-purple-500 bg-purple-50"
              : file
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-purple-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragging ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4"
              >
                <Upload size={32} className="text-purple-600" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Drag & Drop your resume here</h3>
              <p className="text-gray-600 mb-4">Supports PDF, DOC, DOCX formats</p>
              <Button
                type="button"
                onClick={handleButtonClick}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-6 rounded-lg transition-all duration-300"
              >
                Browse Files
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!file}
            className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-6 rounded-lg transition-all duration-300 ${
              !file ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

