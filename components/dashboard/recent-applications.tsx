"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function RecentApplications({ userId }) {
  const [recentJobs, setRecentJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await fetch(`/api/jobs/recent?userId=${userId}`)
        const data = await response.json()
        setRecentJobs(data)
      } catch (error) {
        console.error("Error fetching recent jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentJobs()
  }, [userId])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "interview":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "offer":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your most recent job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recentJobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your most recent job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No applications yet</p>
            <Link href="/dashboard/applications" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Add your first application
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your most recent job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentJobs.map((job) => (
            <div key={job._id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{job.company}</p>
                <p className="text-sm text-muted-foreground">{job.role}</p>
              </div>
              <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
            </div>
          ))}
          <div className="pt-2">
            <Link href="/dashboard/applications" className="text-sm text-blue-600 hover:underline">
              View all applications
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
