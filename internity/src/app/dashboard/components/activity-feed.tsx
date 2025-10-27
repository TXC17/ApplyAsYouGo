import { FileText, Download, Edit, Eye, Share2, Clock } from "lucide-react"

interface ActivityFeedProps {
  limit?: number
}

export default function ActivityFeed({ limit }: ActivityFeedProps) {
  const activities = [
    {
      id: "1",
      type: "edit",
      title: "Software Developer Resume",
      time: "2 hours ago",
      icon: <Edit className="h-4 w-4 text-blue-600" />,
    },
    {
      id: "2",
      type: "download",
      title: "Software Developer Resume",
      time: "Yesterday",
      icon: <Download className="h-4 w-4 text-green-600" />,
    },
    {
      id: "3",
      type: "view",
      title: "UX Designer Portfolio",
      time: "2 days ago",
      icon: <Eye className="h-4 w-4 text-purple-600" />,
    },
    {
      id: "4",
      type: "share",
      title: "Project Manager CV",
      time: "1 week ago",
      icon: <Share2 className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: "5",
      type: "create",
      title: "Marketing Specialist Resume",
      time: "2 weeks ago",
      icon: <FileText className="h-4 w-4 text-amber-600" />,
    },
    {
      id: "6",
      type: "edit",
      title: "Data Analyst Resume",
      time: "3 weeks ago",
      icon: <Edit className="h-4 w-4 text-blue-600" />,
    },
    {
      id: "7",
      type: "download",
      title: "Project Manager CV",
      time: "1 month ago",
      icon: <Download className="h-4 w-4 text-green-600" />,
    },
  ]

  const displayedActivities = limit ? activities.slice(0, limit) : activities

  const getActivityText = (type: string) => {
    switch (type) {
      case "edit":
        return "Edited"
      case "download":
        return "Downloaded"
      case "view":
        return "Viewed"
      case "share":
        return "Shared"
      case "create":
        return "Created"
      default:
        return "Updated"
    }
  }

  return (
    <div className="space-y-1">
      {displayedActivities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="p-2 rounded-full bg-gray-100">{activity.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 truncate">
              <span className="font-medium">{getActivityText(activity.type)}</span> {activity.title}
            </p>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {activity.time}
          </div>
        </div>
      ))}

      {displayedActivities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  )
}

