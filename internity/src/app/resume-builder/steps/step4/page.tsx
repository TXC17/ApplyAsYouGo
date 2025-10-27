"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import ProgressBar from "../../components/progress-bar"
import NavigationButtons from "../../components/navigation-buttons"
import { useResumeForm } from "../../components/resume-form-context"
import SkillsStepContent from "../../components/step-components/skills-step"

export default function SkillsStep() {
  const { saveFormData } = useResumeForm()

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] text-[#f1eece]">
      <div className="w-full max-w-2xl">
        <ProgressBar
          currentStep={4}
          totalSteps={6}
          stepLabels={["Basic Info", "Education", "Experience", "Skills", "Projects", "Review"]}
        />

        <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece] shadow-lg rounded-2xl overflow-hidden p-8">
          <motion.div initial="initial" animate="animate" variants={pageVariants} transition={{ duration: 0.3 }}>
            <SkillsStepContent />

            <NavigationButtons
              currentStep={4}
              totalSteps={6}
              onSaveData={saveFormData}
              backUrl="/resume-builder/steps/step3"
              nextUrl="/resume-builder/steps/step5"
            />
          </motion.div>
        </Card>
      </div>
    </div>
  )
}

