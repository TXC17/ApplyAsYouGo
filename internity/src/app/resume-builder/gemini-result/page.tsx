"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Rocket, CheckCircle, AlertTriangle, Award, ArrowLeft, FileText } from "lucide-react"

export default function GeminiResultPage() {
  const [resumeData, setResumeData] = useState<any>(null)
  const [atsScores, setAtsScores] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedResume = localStorage.getItem("geminiResult")
    const storedScores = localStorage.getItem("atsScores")

    if (storedResume && storedScores) {
      setResumeData(JSON.parse(storedResume))
      setAtsScores(JSON.parse(storedScores))
    }
  }, [])

  const handleBack = () => {
    router.push("/resume-builder")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-gray-100">
      <Card className="w-full max-w-4xl p-8 shadow-2xl rounded-2xl border border-purple-700/30 bg-zinc-900/90 backdrop-blur">
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-3">
            <Rocket className="h-10 w-10 text-purple-500" />
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ATS Score Report
            </h1>
          </div>
          <p className="text-gray-400 text-center max-w-xl">
            Your resume has been analyzed by our AI to determine how well it will perform with Applicant Tracking
            Systems
          </p>
        </div>

        {!resumeData || !atsScores ? (
          <div className="text-center text-gray-400 py-12">
            <div className="animate-pulse flex flex-col items-center">
              <FileText className="h-12 w-12 text-purple-500 mb-4" />
              <p>Loading your analysis results...</p>
            </div>
          </div>
        ) : (
          <div>
            {/* ATS Scoring */}
            <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 rounded-xl p-8 border border-purple-700/30 shadow-lg shadow-purple-900/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                  <Award className="h-6 w-6" /> ATS Performance Score
                </h2>
                <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 p-2 px-4 rounded-full border border-purple-500/40 shadow-inner shadow-purple-900/20">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    {atsScores.totalScore}/100
                  </span>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Formatting */}
                <div className="bg-black/30 p-6 rounded-xl border border-purple-700/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-900/50 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-300" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-100">Document Format</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-full bg-zinc-700/50 h-2 rounded-full">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${atsScores.formattingScore}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-purple-300 min-w-[40px] text-center">
                        {atsScores.formattingScore}%
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                        <p className="text-green-300 text-sm">{atsScores.formattingFeedback?.good}</p>
                      </div>
                      {atsScores.formattingFeedback?.needsImprovement && (
                        <div className="flex gap-3 items-start bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/20">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
                          <p className="text-yellow-300 text-sm">{atsScores.formattingFeedback.needsImprovement}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grammar */}
                <div className="bg-black/30 p-6 rounded-xl border border-purple-700/20 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-pink-900/50 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-pink-300" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-100">Language Quality</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-full bg-zinc-700/50 h-2 rounded-full">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${atsScores.grammarScore}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-pink-300 min-w-[40px] text-center">
                        {atsScores.grammarScore}%
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start bg-green-900/20 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                        <p className="text-green-300 text-sm">{atsScores.grammarFeedback?.good}</p>
                      </div>
                      {atsScores.grammarFeedback?.needsImprovement && (
                        <div className="flex gap-3 items-start bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/20">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
                          <p className="text-yellow-300 text-sm">{atsScores.grammarFeedback.needsImprovement}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Recommendations Section */}
              <div className="md:col-span-2 mt-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-white">Recommendations</h3>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300">
                    {atsScores.totalScore >= 80
                      ? "Your resume is well-optimized for ATS systems. Consider applying to your target positions with confidence."
                      : "To improve your ATS score, focus on addressing the improvement areas highlighted above. Consider using industry-specific keywords relevant to your target positions."}
                  </p>

                  <div className="flex items-center gap-2 text-purple-300">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm">Use clear section headings</p>
                  </div>

                  <div className="flex items-center gap-2 text-purple-300">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm">Include relevant keywords from the job description</p>
                  </div>

                  <div className="flex items-center gap-2 text-purple-300">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-sm">Use standard file formats (PDF, DOCX)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button
            onClick={handleBack}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-10 py-6 rounded-lg flex items-center gap-3 text-lg font-medium shadow-lg shadow-purple-900/30 transition-all hover:shadow-purple-900/50"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Resume Builder
          </Button>
        </div>
      </Card>
    </div>
  )
}
