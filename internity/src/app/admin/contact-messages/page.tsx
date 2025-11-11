"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ContactMessage {
  name: string
  email: string
  phone: string
  message: string
  status: string
  created_at: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to access admin panel")
      router.push("/login")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages()
    }
  }, [filter, isAuthenticated])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        toast.error("Please login to access admin panel")
        router.push("/login")
        return
      }

      const url = filter === "all" 
        ? 'http://127.0.0.1:5000/admin/contact-messages'
        : `http://127.0.0.1:5000/admin/contact-messages/${filter}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessages(data.messages)
      } else if (response.status === 403) {
        toast.error("Access denied. Admin privileges required.")
        router.push("/dashboard")
      } else if (response.status === 401) {
        toast.error("Session expired. Please login again.")
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast.error(data.message || "Failed to fetch messages")
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contact Form Messages</h1>
            <p className="text-gray-400 text-sm mt-1">Admin Panel - Restricted Access</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded ${filter === "all" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-4 py-2 rounded ${filter === "new" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              New
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded ${filter === "read" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              Read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No messages found</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{msg.name}</h3>
                    <p className="text-gray-400">{msg.email}</p>
                    {msg.phone && <p className="text-gray-400">{msg.phone}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-sm ${
                      msg.status === 'new' ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {msg.status}
                    </span>
                    <p className="text-gray-400 text-sm mt-2">{formatDate(msg.created_at)}</p>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
