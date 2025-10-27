import { FileText, Download, Eye, Award, TrendingUp } from "lucide-react"

export default function StatsCards() {
  const stats = [
    {
      title: "Total Resumes",
      value: "12",
      change: "+3 this month",
      trend: "up",
      icon: <FileText className="h-5 w-5 text-purple-600" />,
    },
    {
      title: "Downloads",
      value: "48",
      change: "+15 this month",
      trend: "up",
      icon: <Download className="h-5 w-5 text-indigo-600" />,
    },
    {
      title: "Profile Views",
      value: "1,254",
      change: "+22% from last month",
      trend: "up",
      icon: <Eye className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Achievement Level",
      value: "Pro",
      change: "2 badges earned",
      trend: "neutral",
      icon: <Award className="h-5 w-5 text-amber-600" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">{stat.icon}</div>
          </div>
          <div className="flex items-center mt-3 text-xs">
            {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />}
            <span className={`${stat.trend === "up" ? "text-emerald-500" : "text-gray-500"}`}>{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

