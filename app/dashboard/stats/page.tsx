"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { StatusChart } from "@/components/stats/status-chart"
import { TimelineChart } from "@/components/stats/timeline-chart"
import { CompanyChart } from "@/components/stats/company-chart"

export default function StatsPage() {
  const { user, isLoaded } = useUser()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchJobs = async () => {
    if (!isLoaded || !user) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/jobs?userId=${user.id}`)
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch job applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchJobs()
    }
  }, [isLoaded, user])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-1">Analyze your job application progress</p>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">Application Timeline</TabsTrigger>
          <TabsTrigger value="companies">Top Companies</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Breakdown of your applications by current status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : (
                <StatusChart jobs={jobs} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Your application activity over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : (
                <TimelineChart jobs={jobs} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Companies</CardTitle>
              <CardDescription>Companies you've applied to the most</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : (
                <CompanyChart jobs={jobs} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
