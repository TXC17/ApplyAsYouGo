"use client"

import { Upload, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import { BackgroundLines } from "@/components/ui/background-lines";

export default function ResumeBuilderLanding() {
  const router = useRouter()

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 },
    },
  }

  return (
   
    <BackgroundLines>
      
    
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] text-[#f1eece]">
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#f1eece] mb-4">Start Your Resume 🚀</h1>
        <p className="text-xl text-[#f1eece]/80 max-w-2xl mx-auto">
          Create a professional resume in minutes. Choose how you want to get started.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <motion.div whileHover="hover" variants={cardVariants}>
          <Card className="h-full backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 rounded-full bg-[rgba(30,30,35,0.5)] flex items-center justify-center mb-6">
                <Upload size={32} className="text-[#f1eece]" />
              </div>
              <h2 className="text-2xl font-bold text-[#f1eece] mb-4">Upload Resume</h2>
              <p className="text-[#f1eece]/80 text-center mb-6">
                Already have a resume? Upload it and we'll help you enhance it.
              </p>
              <Button
                className="bg-[#f1eece] text-[#131318] hover:bg-[#f1eece]/80"
                onClick={() => router.push("/resume-builder/upload")}
              >
                Upload File
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover="hover" variants={cardVariants}>
          <Card className="h-full backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece] shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 rounded-full bg-[rgba(30,30,35,0.5)] flex items-center justify-center mb-6">
                <FileText size={32} className="text-[#f1eece]" />
              </div>
              <h2 className="text-2xl font-bold text-[#f1eece] mb-4">Build From Scratch</h2>
              <p className="text-[#f1eece]/80 text-center mb-6">
                Create a new resume with our step-by-step guided process.
              </p>
              <Button
                className="bg-[#f1eece] text-[#131318] hover:bg-[#f1eece]/80"
                onClick={() => router.push("/resume-builder/steps/step1")}
              >
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Navbar />
    </div>
    </BackgroundLines>
    
  )
}

