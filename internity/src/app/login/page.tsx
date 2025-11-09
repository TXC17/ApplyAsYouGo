"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/context"
import { BackgroundBeams } from "@/components/ui/background-beams"
import Navbar from "@/components/layout/Navbar"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { storeTokenInLS } = useAuth()

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isLoading) return

    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/user/login', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })

        const res_data = await response.json()
        
        if (response.ok) {
          storeTokenInLS(res_data.token, res_data.user)
          console.log("Login successful")
          router.push("/dashboard")
        } else {
          // Handle server errors
          if (res_data.message) {
            setErrors({ email: res_data.message })
          } else {
            setErrors({ email: "An error occurred during login" })
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        setErrors({ email: "Failed to connect to server. Please check if the backend is running." })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between p-4 md:p-8 bg-neutral-950 relative">
      {/* Left side with main heading and subtext */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-10 md:mt-0 z-10 px-4 md:px-16">
        <h1 className="text-4xl md:text-7xl font-bold text-[#f1eece] mb-4 leading-tight">
          Welcome Back, Trailblazer
        </h1>
        <p className="text-lg md:text-2xl text-[#e6e2b1]">
          Sign in to unlock your next opportunity. Your journey to success continues here—smarter, faster, and bolder than ever.
        </p>
      </div>

      {/* Right side with login card */}
      <div className="w-full md:w-1/2 flex justify-center z-10 px-4 md:px-0 mb-8 md:mb-0">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece] shadow-lg rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#f1eece] mb-2">Welcome Back</h1>
                <p className="text-[#e6e2b1]">Sign in to continue building your career</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#f1eece]">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#e6e2b1]">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="text-[#f1eece]">
                      Password
                    </Label>
                    <Link href="#" className="text-sm text-[#e6e2b1] hover:text-[#f1eece] transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`${errors.password ? "border-red-500" : ""}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#e6e2b1] hover:text-[#f1eece]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-[#e6e2b1]">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-[#ff667c] hover:text-white font-medium transition-colors">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Navbar />
      <BackgroundBeams />
    </div>
  )
}
