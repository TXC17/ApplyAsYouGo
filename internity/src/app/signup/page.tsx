"use client"
import React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from '@/app/context/context'
import Navbar from "@/components/layout/Navbar"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const router = useRouter()
  const { storeTokenInLS } = useAuth()
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (isLoading) return

    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/signup' || 'http://localhost:5000/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })
        
        const res_data = await response.json()
        
        if (response.ok) {
          storeTokenInLS(res_data.token, res_data.user)
          console.log("Signup successful")
          router.push("/dashboard")
        } else {
          // Handle server errors
          if (res_data.message) {
            setErrors({ email: res_data.message })
          } else {
            setErrors({ email: "An error occurred during signup" })
          }
        }
      } catch (error) {
        console.error("Signup error:", error)
        setErrors({ email: "Failed to connect to server. Please check if the backend is running." })
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-between p-4 md:p-6 lg:p-8 bg-neutral-950 relative">
        {/* Left side with signup form - Full width on mobile, half on desktop */}
        <div className="w-full md:w-1/2 flex justify-center z-10 mb-8 md:mb-0">
          <div className="w-full max-w-md px-4 sm:px-0">
            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece] shadow-lg rounded-2xl overflow-hidden p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#f1eece] mb-2">Create an Account</h1>
                <p className="text-sm md:text-base text-[#e6e2b1]">Join us and start building your professional resume</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#f1eece]">Full Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#f1eece]">
                      <User size={18} />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={`pl-10 bg-transparent text-[#f1eece] border-[#f1eece]/50 ${errors.name ? "border-red-500" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#f1eece]">Email</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#f1eece]">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-10 bg-transparent text-[#f1eece] border-[#f1eece]/50 ${errors.email ? "border-red-500" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#f1eece]">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`bg-transparent text-[#f1eece] border-[#f1eece]/50 pr-10 ${errors.password ? "border-red-500" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#f1eece]/80 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#f1eece]">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`bg-transparent text-[#f1eece] border-[#f1eece]/50 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#f1eece]/80 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm md:text-base text-[#e6e2b1]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#ff667c] hover:text-white font-medium transition-colors">
                    Login
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Right side with main heading and subtext - Hidden on mobile, shown on desktop */}
        <div className="w-full md:w-1/2 px-4 md:pl-8 md:pr-16 z-10 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#f1eece] mb-4 md:mb-6">Build Your Future</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#e6e2b1] leading-relaxed">
            Create professional resumes that stand out from the crowd. Our platform helps you showcase your skills and experience in a compelling way that catches employers' attention.
          </p>
        </div>
        
        {/* Background Beams component */}
        <BackgroundBeams />
      </div>
    </>
  )
}