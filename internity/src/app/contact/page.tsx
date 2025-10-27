"use client"

import type React from "react"
import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout"
import { toast } from "sonner"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ExpandableFAQ from "@/components/ui/ExpandableCard"

export default function ContactPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  })

  // Handle form input changes
  interface FormData {
    name: string
    email: string
    message: string
    phone: string
  }

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

  const handleInputChange = (e: InputChangeEvent): void => {
    const { name, value } = e.target
    setFormData((prevFormData: FormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  // Handle form submission
  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: SubmitEvent): Promise<void> => {
    e.preventDefault()

    try {
      const response = await fetch('http://127.0.0.1:5000/user/contactus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormData({ name: '', email: '', message: '', phone: '' });
        toast.success(data.message || "Thank you for your message! We will get back to you soon.");
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error("Failed to connect to server. Please check if the backend is running.");
    }
  }

  return (
    <MainLayout>
      {/* Contact Form Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-gray-400 mb-2 block">Reach Out for Support</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you need help with your Apply As You Go account, want to inquire about our features, or have
              feedback, our team is ready to assist. Drop us a message and we'll get back to you promptly.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number (optional)"
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md">
                  Submit
                </Button>
              </div>
            </form>

          </div>
        </div>
      </section>

      {/* FAQs Section - Now using the ExpandableFAQ component */}
      <ExpandableFAQ />

    </MainLayout>
  )
}

