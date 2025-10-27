import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-r from-[rgba(8,8,8,0.7)] to-[rgba(10,10,10,0.7)]">{children}</div>
}
