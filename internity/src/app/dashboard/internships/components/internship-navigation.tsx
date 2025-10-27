"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InternshipNavigation() {
  const pathname = usePathname()
  const currentTab = pathname.includes("/linkedin")
    ? "linkedin"
    : pathname.includes("/unstop")
      ? "unstop"
      : "internshala"

  return (
    <Tabs value={currentTab} className="mb-6">
      <TabsList className="grid grid-cols-3 bg-[rgba(30,30,35,0.5)]">
        <TabsTrigger
          value="linkedin"
          className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
          asChild
        >
          <Link href="/dashboard/internships/linkedin">LinkedIn</Link>
        </TabsTrigger>
        <TabsTrigger
          value="internshala"
          className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
          asChild
        >
          <Link href="/dashboard/internships/internshala">Internshala</Link>
        </TabsTrigger>
        <TabsTrigger
          value="unstop"
          className="data-[state=active]:bg-[#f1eece] data-[state=active]:text-[#131318] text-[#f1eece]/80"
          asChild
        >
          <Link href="/dashboard/internships/unstop">Unstop</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
