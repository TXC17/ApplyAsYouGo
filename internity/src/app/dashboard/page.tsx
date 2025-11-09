"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Briefcase,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  Building,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Toaster } from "sonner"
import SmartScraperCredentialsForm from "./components/smart-scraper-credentials-form"
import { useAuth } from "@/app/context/context"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { user, logoutUser, isLoggedIn, AuthorizationToken } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
  }, [isLoggedIn, router])
  const [agentActive, setAgentActive] = useState(false)
  const [activeInternshipTab, setActiveInternshipTab] = useState("linkedin")

  // Loading states for each platform
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false)
  const [isInternshalaLoading, setIsInternshalaLoading] = useState(false)
  const [isUnstopLoading, setIsUnstopLoading] = useState(false)

  // Internship data for each platform
  const [linkedInInternships, setLinkedInInternships] = useState<LinkedInInternship[]>([])
  const [internshalaInternships, setInternshalaInternships] = useState<InternshalaInternship[]>([])
  const [unstopInternships, setUnstopInternships] = useState<UnstopInternship[]>([])

  // Use real user data from authentication
  const userData = user || {
    name: "Student",
    email: "student@college.edu",
  }

  // User applications - fetched from database
  const [applications, setApplications] = useState<any[]>([])

  // Fetch user applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isLoggedIn || !AuthorizationToken) return

      try {
        const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/user/applications', {
          headers: {
            'Authorization': AuthorizationToken
          }
        })

        if (response.ok) {
          const data = await response.json()
          setApplications(data.applications || [])
        }
      } catch (error) {
        console.error('Error fetching applications:', error)
        // Keep applications empty for new users
        setApplications([])
      }
    }

    fetchApplications()
  }, [isLoggedIn, AuthorizationToken])

  // Error states for scrapers
  const [linkedInError, setLinkedInError] = useState<string | null>(null)
  const [internshalaError, setInternshalaError] = useState<string | null>(null)
  const [unstopError, setUnstopError] = useState<string | null>(null)



  useEffect(() => {
    const clock = document.getElementById("system-clock")
    const date = document.getElementById("system-date")

    if (!clock || !date) return

    function updateTime() {
      const now = new Date()

      if (clock) {
        clock.textContent = now.toLocaleTimeString("en-US", { hour12: false })
      }
      if (date) {
        date.textContent = now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      }
    }

    const intervalId = setInterval(updateTime, 1000)
    updateTime()

    return () => clearInterval(intervalId) // Cleanup interval on component unmount
  }, [])

  // Load initial data - start with empty arrays for new users
  useEffect(() => {
    // Initialize with empty arrays - users need to scrape to get data
    setLinkedInInternships([])
    setInternshalaInternships([])
    setUnstopInternships([])

    // MongoDB integration would look like this (commented out as requested)
    /*
    const fetchInternships = async () => {
      try {
        // Connect to MongoDB
        // const client = await connectToMongoDB();
        // const db = client.db("resume_platform");
        
        // Fetch internships for each platform
        // const linkedInData = await db.collection("internships").find({ source: "linkedin" }).toArray();
        // const internshalaData = await db.collection("internships").find({ source: "internshala" }).toArray();
        // const unstopData = await db.collection("internships").find({ source: "unstop" }).toArray();
        
        // Update state with fetched data
        // setLinkedInInternships(linkedInData);
        // setInternshalaInternships(internshalaData);
        // setUnstopInternships(unstopData);
        
        // Close MongoDB connection
        // await client.close();
      } catch (error) {
        console.error("Error fetching internships:", error);
      }
    };
    
    fetchInternships();
    */
  }, [])

  const handleAgentToggle = (checked: boolean) => {
    setAgentActive(checked)

    // This would trigger the AI agent to start/stop in a real app
    // Backend integration would go here (commented out as requested)
    /*
    if (checked) {
      // Start the AI agent
      fetch('/api/agent/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } else {
      // Stop the AI agent
      fetch('/api/agent/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
    }
    */
  }



  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Interview":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  // Handle scraping for each platform
  const handleScrapeLinkedIn = async () => {
    setIsLinkedInLoading(true)
    setLinkedInError(null)

    try {
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/linkedin/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'internship',
          usertype: 'fresher',
          passing_year: '2027',
          quick_apply: true
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Fetch the scraped data from the list endpoint
        const listResponse = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/linkedin/list')
        const listData = await listResponse.json()

        if (listResponse.ok && listData.data) {
          const transformedData = listData.data.map((item: any) => ({
            id: item._id || `linkedin-${Date.now()}-${Math.random()}`,
            title: item.title || 'Internship Position',
            company: item.company || 'Company',
            location: item.location || 'Location not specified',
            duration: '3-6 Months',
            stipend: 'Competitive',
            category: item.category || 'internship'
          }))
          setLinkedInInternships(transformedData)
        } else {
          setLinkedInError('No internships found. Try scraping again.')
          setLinkedInInternships([])
        }
      } else {
        setLinkedInError(data.message || 'Failed to scrape LinkedIn internships')
        setLinkedInInternships([])
      }
    } catch (error) {
      console.error('Error scraping LinkedIn:', error)
      setLinkedInError('Network error. Please check if the backend is running.')
      setLinkedInInternships([])
    } finally {
      setIsLinkedInLoading(false)
    }
  }

  const handleScrapeInternshala = async () => {
    setIsInternshalaLoading(true)
    setInternshalaError(null)

    try {
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/internshala/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'web-development',
          usertype: 'fresher',
          passing_year: '2027',
          quick_apply: true
        }),
      })

      const data = await response.json()

      if (response.ok && data.count > 0) {
        // Fetch the scraped data from the list endpoint
        const listResponse = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/internshala/list')
        const listData = await listResponse.json()

        if (listResponse.ok && listData.data) {
          const transformedData = listData.data.map((item: any) => ({
            id: item._id || `internshala-${Date.now()}-${Math.random()}`,
            title: item.title || 'Internship Position',
            company: item.company || 'Company',
            applicants: item.applicants || 'N/A',
            days_left: item.days_left || 'N/A',
            skills: item.skills || [],
            category: item.category || 'internship',
            scraped_at: new Date().toISOString(),
            url: item.apply_link
          }))
          setInternshalaInternships(transformedData)
        } else {
          setInternshalaError('No internships found. Try scraping again.')
          setInternshalaInternships([])
        }
      } else {
        setInternshalaError(data.message || 'Failed to scrape Internshala internships')
        setInternshalaInternships([])
      }
    } catch (error) {
      console.error('Error scraping Internshala:', error)
      setInternshalaError('Network error. Please check if the backend is running.')
      setInternshalaInternships([])
    } finally {
      setIsInternshalaLoading(false)
    }
  }

  const handleScrapeUnstop = async () => {
    setIsUnstopLoading(true)
    setUnstopError(null)

    try {
      const response = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'internships',
          quick_apply: true,
          usertype: 'student'
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        // Fetch the scraped internships from the database
        const internshipsResponse = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1/internships?limit=10')
        const internshipsData = await internshipsResponse.json()

        if (internshipsResponse.ok && internshipsData.internships && internshipsData.internships.length > 0) {
          // Transform the data to match our frontend format
          const transformedInternships = internshipsData.internships.map((internship: any) => ({
            id: internship.opp_id || `unstop-${Date.now()}-${Math.random()}`,
            title: internship.title || 'Internship Position',
            company: internship.company || 'Company',
            location: internship.location || 'Remote',
            duration: '3-6 Months',
            stipend: 'Competitive',
            category: 'internship'
          }))

          setUnstopInternships(transformedInternships)
        } else {
          setUnstopError('No internships found. Try scraping again.')
          setUnstopInternships([])
        }
      } else {
        setUnstopError(data.message || 'Failed to scrape Unstop internships')
        setUnstopInternships([])
      }
    } catch (error) {
      console.error('Error scraping Unstop:', error)
      setUnstopError('Network error. Please check if the backend is running.')
      setUnstopInternships([])
    } finally {
      setIsUnstopLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)] text-[#f1eece]">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Sidebar / Navigation */}
          <div className="w-full md:w-64 mb-8 md:mb-0">
            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[rgba(30,30,35,0.5)] flex items-center justify-center overflow-hidden mb-4 border-2 border-[#f1eece]/30">
                    <div className="w-full h-full bg-gradient-to-br from-[#7d0d1b] to-[#a90519] flex items-center justify-center text-[#f1eece] text-2xl font-bold">
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-[#f1eece]">{userData?.name || 'User'}</h2>
                  <p className="text-[#f1eece]/70 text-sm">{userData?.email || 'user@example.com'}</p>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(30,30,35,0.5)] text-[#f1eece] hover:bg-[rgba(30,30,35,0.7)] transition-colors"
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
                  >
                    <Settings size={18} />
                    <span>Profile Settings</span>
                  </Link>
                  <Link
                    href="/dashboard/internships"
                    className="flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
                  >
                    <Briefcase size={18} />
                    <span>Internships</span>
                  </Link>
                  <Link
                    href="/resume-builder"
                    className="flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
                  >
                    <Settings size={18} />
                    <span>Resume Builder</span>
                  </Link>
                  {/* <button className="w-full flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors">
                    <Bell size={18} />
                    <span>Notifications</span>
                  </button> */}
                  <button
                    onClick={() => {
                      logoutUser()
                      router.push("/")
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-[#f1eece]/70 hover:bg-[rgba(30,30,35,0.5)] transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </Card>

            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden mt-6">
              <div className="p-6 text-center space-y-6">
                <div>
                  <h4 className="text-xs uppercase text-[#f1eece]/40 tracking-wide">System Time</h4>
                  <h1 className="text-4xl font-semibold text-[#f1eece] tracking-wider" id="system-clock">
                    00:00:00
                  </h1>
                  <p className="text-[#f1eece]/60 text-sm tracking-wide mt-1" id="system-date">
                    Apr 10, 2025
                  </p>
                </div>
                {/* <div className="grid grid-cols-2 gap-4 pt-2">
      <div className="bg-[rgba(30,30,35,0.3)] rounded-lg p-3 text-[#f1eece]/70 text-xs">
        <div className="uppercase text-[10px] text-[#f1eece]/50 mb-1 tracking-wide">Uptime</div>
        <div id="uptime" className="font-mono text-[#f1eece] text-sm">00d 00:00:00</div>
      </div>
      <div className="bg-[rgba(30,30,35,0.3)] rounded-lg p-3 text-[#f1eece]/70 text-xs">
        <div className="uppercase text-[10px] text-[#f1eece]/50 mb-1 tracking-wide">Time Zone</div>
        <div id="timezone" className="font-mono text-[#f1eece] text-sm">UTC+00:00</div>
      </div>
    </div> */}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* AI Agent Panel */}
            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#f1eece] flex items-center">
                    <Sparkles size={20} className="mr-2" />
                    AI Agent
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[#f1eece]/70">{agentActive ? "Active" : "Inactive"}</span>
                    <Switch
                      checked={agentActive}
                      onCheckedChange={handleAgentToggle}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${agentActive ? "bg-green-500/10 border border-green-500/30" : "bg-[rgba(30,30,35,0.5)] border border-[#f1eece]/20"}`}
                >
                  <p className="text-[#f1eece]/90">
                    {agentActive
                      ? "Your AI agent is actively searching for internships that match your profile. It will automatically apply to suitable positions on your behalf."
                      : "Activate your AI agent to automatically search and apply for internships that match your profile."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#f1eece]">Recent Applications</h3>
                    <Link
                      href="/dashboard/internships"
                      className="text-[#f1eece]/70 text-sm hover:text-[#f1eece] transition-colors flex items-center"
                    >
                      View All
                      <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>

                  {applications.length > 0 ? (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="p-4 border border-[#f1eece]/10 rounded-lg bg-[rgba(30,30,35,0.5)] hover:bg-[rgba(30,30,35,0.7)] transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-[#f1eece]">{app.position}</h4>
                              <p className="text-[#f1eece]/70 text-sm">{app.company}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`${getStatusColor(app.status)}`}>{app.status}</Badge>
                                <span className="text-xs text-[#f1e  eece]/50">via {app.source}</span>
                              </div>
                            </div>
                            <span className="text-xs text-[#f1eece]/50">{new Date(app.applied_date || app.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#f1eece]/50">
                      <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium mb-2">No Applications Yet</p>
                      <p className="text-sm">Start by activating the AI agent or manually applying to internships.</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Smart Scraper Credentials Form */}
            <div className="mb-6">
              <SmartScraperCredentialsForm />
            </div>

            {/* Internships Section */}
            <Card className="backdrop-blur-sm bg-[rgba(19,19,24,0.85)] border border-[#f1eece]/20 shadow-lg rounded-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#f1eece] mb-6">Internship Sources</h2>

                <Tabs defaultValue="linkedin" value={activeInternshipTab} onValueChange={setActiveInternshipTab}>
                  <TabsList className="grid grid-cols-3 mb-6 bg-[rgba(30,30,35,0.5)]">
                    <TabsTrigger
                      value="linkedin"
                      className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
                    >
                      LinkedIn
                    </TabsTrigger>
                    <TabsTrigger
                      value="internshala"
                      className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
                    >
                      Internshala
                    </TabsTrigger>
                    <TabsTrigger
                      value="unstop"
                      className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
                    >
                      Unstop
                    </TabsTrigger>
                  </TabsList>

                  {/* LinkedIn Tab */}
                  <TabsContent value="linkedin">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-[#f1eece]">LinkedIn Internships</h3>
                      <Button
                        onClick={handleScrapeLinkedIn}
                        disabled={isLinkedInLoading}
                        className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
                      >
                        {isLinkedInLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
                            Scraping...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} className="mr-2" />
                            Scrape Now
                          </>
                        )}
                      </Button>
                    </div>

                    {isLinkedInLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
                        <span className="ml-3 text-[#f1eece]/70">Scraping LinkedIn internships...</span>
                      </div>
                    ) : linkedInError ? (
                      <div className="text-center py-12 text-red-400">
                        <p className="text-lg font-medium mb-2">Scraping Failed</p>
                        <p className="text-sm">{linkedInError}</p>
                        <button
                          onClick={handleScrapeLinkedIn}
                          className="mt-4 px-4 py-2 bg-[#a90519] hover:bg-[#ff102a] text-[#f1eece] rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : linkedInInternships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {linkedInInternships.map((internship) => (
                          <motion.div
                            key={internship.id}
                            className="bg-[rgba(19,19,24,0.85)] text-[#f1eece] border border-[#f1eece]/20 rounded-xl p-4 shadow transition hover:scale-[1.01]"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-col h-full">
                              <h4 className="text-lg font-semibold text-[#f1eece]">{internship.title}</h4>
                              <div className="flex items-center text-[#f1eece]/70 mt-1">
                                <Building size={16} className="mr-1" />
                                {internship.company}
                              </div>

                              <div className="grid grid-cols-1 gap-2 mt-3">
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <MapPin size={14} className="mr-1" />
                                  {internship.location}
                                </div>
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <Clock size={14} className="mr-1" />
                                  {internship.duration}
                                </div>
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <DollarSign size={14} className="mr-1" />
                                  {internship.stipend}
                                </div>
                              </div>

                              <div className="mt-auto pt-3">
                                <Badge className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                                  {internship.category}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-[#f1eece]/50">
                        <p>No LinkedIn internships found. Click "Scrape Now" to fetch the latest listings.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Internshala Tab */}
                  <TabsContent value="internshala">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-[#f1eece]">Internshala Internships</h3>
                      <Button
                        onClick={handleScrapeInternshala}
                        disabled={isInternshalaLoading}
                        className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
                      >
                        {isInternshalaLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
                            Scraping...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} className="mr-2" />
                            Scrape Now
                          </>
                        )}
                      </Button>
                    </div>

                    {isInternshalaLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
                        <span className="ml-3 text-[#f1eece]/70">Scraping Internshala internships...</span>
                      </div>
                    ) : internshalaError ? (
                      <div className="text-center py-12 text-red-400">
                        <p className="text-lg font-medium mb-2">Scraping Failed</p>
                        <p className="text-sm">{internshalaError}</p>
                        <button
                          onClick={handleScrapeInternshala}
                          className="mt-4 px-4 py-2 bg-[#a90519] hover:bg-[#ff102a] text-[#f1eece] rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : internshalaInternships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {internshalaInternships.map((internship) => (
                          <motion.div
                            key={internship.id}
                            className="bg-[rgba(19,19,24,0.85)] text-[#f1eece] border border-[#f1eece]/20 rounded-xl p-4 shadow transition hover:scale-[1.01]"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-col h-full">
                              <h4 className="text-lg font-semibold text-[#f1eece]">{internship.title}</h4>
                              <div className="flex items-center text-[#f1eece]/70 mt-1">
                                <Building size={16} className="mr-1" />
                                {internship.company}
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="text-[#f1eece]/70 text-sm">
                                  <span className="font-medium">Applicants:</span> {internship.applicants}
                                </div>
                                <div className="text-[#f1eece]/70 text-sm">
                                  <span className="font-medium">Days Left:</span> {internship.days_left}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-3">
                                {internship.skills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="mt-auto pt-3 flex justify-between items-center">
                                <Badge className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                                  {internship.category}
                                </Badge>
                                <div className="text-[#f1eece]/50 text-xs">
                                  Scraped: {new Date(internship.scraped_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-[#f1eece]/50">
                        <p>No Internshala internships found. Click "Scrape Now" to fetch the latest listings.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Unstop Tab */}
                  <TabsContent value="unstop">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-[#f1eece]">Unstop Internships</h3>
                      <Button
                        onClick={handleScrapeUnstop}
                        disabled={isUnstopLoading}
                        className="bg-gradient-to-r from-[#7d0d1b] to-[#a90519] hover:from-[#a90519] hover:to-[#ff102a] text-[#f1eece] border-none"
                      >
                        {isUnstopLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-[#f1eece] border-t-transparent rounded-full"></div>
                            Scraping...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={16} className="mr-2" />
                            Scrape Now
                          </>
                        )}
                      </Button>
                    </div>

                    {isUnstopLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-6 w-6 border-2 border-[#a90519] border-t-transparent rounded-full"></div>
                        <span className="ml-3 text-[#f1eece]/70">Scraping Unstop internships...</span>
                      </div>
                    ) : unstopError ? (
                      <div className="text-center py-12 text-red-400">
                        <p className="text-lg font-medium mb-2">Scraping Failed</p>
                        <p className="text-sm">{unstopError}</p>
                        <button
                          onClick={handleScrapeUnstop}
                          className="mt-4 px-4 py-2 bg-[#a90519] hover:bg-[#ff102a] text-[#f1eece] rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : unstopInternships.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unstopInternships.map((internship) => (
                          <motion.div
                            key={internship.id}
                            className="bg-[rgba(19,19,24,0.85)] text-[#f1eece] border border-[#f1eece]/20 rounded-xl p-4 shadow transition hover:scale-[1.01]"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-col h-full">
                              <h4 className="text-lg font-semibold text-[#f1eece]">{internship.title}</h4>
                              <div className="flex items-center text-[#f1eece]/70 mt-1">
                                <Building size={16} className="mr-1" />
                                {internship.company}
                              </div>

                              <div className="grid grid-cols-1 gap-2 mt-3">
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <MapPin size={14} className="mr-1" />
                                  {internship.location}
                                </div>
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <Clock size={14} className="mr-1" />
                                  {internship.duration}
                                </div>
                                <div className="flex items-center text-[#f1eece]/70 text-sm">
                                  <DollarSign size={14} className="mr-1" />
                                  {internship.stipend}
                                </div>
                              </div>

                              <div className="mt-auto pt-3">
                                <Badge className="bg-[#f1eece]/10 text-[#f1eece]/90 border border-[#f1eece]/20">
                                  {internship.category}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-[#f1eece]/50">
                        <p>No Unstop internships found. Click "Scrape Now" to fetch the latest listings.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Type definitions for the internship data structures
interface LinkedInInternship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  category: string
}

interface InternshalaInternship {
  id: string
  title: string
  company: string
  applicants: string
  days_left: string
  skills: string[]
  category: string
  scraped_at: string
  url: string | null
}

interface UnstopInternship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  stipend: string
  category: string
}
