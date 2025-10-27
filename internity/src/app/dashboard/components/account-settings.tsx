"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Lock, Bell, Globe, Shield, Upload, Eye } from "lucide-react"
import { useAuth } from "@/app/context/context"

export default function AccountSettings() {
  const { user } = useAuth()
  
  const userData = user || {
    name: "User",
    email: "user@example.com",
  }
  
  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: userData.email,
    phone: "",
    bio: "",
    avatarUrl: "",
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    resumeViews: true,
    newFeatures: true,
    tips: false,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    allowDataCollection: true,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-1">
              <Upload size={14} />
              Change Photo
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Full Name
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Mail size={16} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Phone size={16} />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-700">
                Current Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <Input id="currentPassword" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock size={16} />
                </div>
                <Input id="newPassword" type="password" placeholder="••••••••" className="pl-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            Save Changes
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Email Updates</Label>
              </div>
              <p className="text-sm text-gray-500">Receive weekly updates about your account</p>
            </div>
            <Switch
              checked={notifications.emailUpdates}
              onCheckedChange={() => handleNotificationChange("emailUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Resume Views</Label>
              </div>
              <p className="text-sm text-gray-500">Get notified when someone views your resume</p>
            </div>
            <Switch
              checked={notifications.resumeViews}
              onCheckedChange={() => handleNotificationChange("resumeViews")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">New Features</Label>
              </div>
              <p className="text-sm text-gray-500">Stay updated on new features and improvements</p>
            </div>
            <Switch
              checked={notifications.newFeatures}
              onCheckedChange={() => handleNotificationChange("newFeatures")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Resume Tips</Label>
              </div>
              <p className="text-sm text-gray-500">Receive tips to improve your resume</p>
            </div>
            <Switch checked={notifications.tips} onCheckedChange={() => handleNotificationChange("tips")} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            Save Preferences
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="privacy" className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Public Profile</Label>
              </div>
              <p className="text-sm text-gray-500">Make your profile visible to others</p>
            </div>
            <Switch checked={privacy.profilePublic} onCheckedChange={() => handlePrivacyChange("profilePublic")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Show Email</Label>
              </div>
              <p className="text-sm text-gray-500">Display your email on your public profile</p>
            </div>
            <Switch checked={privacy.showEmail} onCheckedChange={() => handlePrivacyChange("showEmail")} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-600 mr-2" />
                <Label className="text-base font-medium">Data Collection</Label>
              </div>
              <p className="text-sm text-gray-500">Allow us to collect usage data to improve our service</p>
            </div>
            <Switch
              checked={privacy.allowDataCollection}
              onCheckedChange={() => handlePrivacyChange("allowDataCollection")}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
          <p className="text-sm text-gray-600 mb-4">
            You can download all your data or delete your account permanently.
          </p>
          <div className="flex gap-4">
            <Button variant="outline">Download My Data</Button>
            <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            Save Privacy Settings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

