"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { JobForm } from "@/components/job-form"
import { JobList } from "@/components/job-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ApplicationsPage() {
  const { user, isLoaded } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingJob, setEditingJob] = useState(null)
  const [activeFilter, setActiveFilter] = useState("all")
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

  const handleAddJob = async (jobData) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobData,
          userId: user.id,
        }),
      })

      if (response.ok) {
        fetchJobs()
        setShowForm(false)
        toast({
          title: "Success",
          description: "Job application added successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add job application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding job:", error)
      toast({
        title: "Error",
        description: "Failed to add job application",
        variant: "destructive",
      })
    }
  }

  const handleUpdateJob = async (id, jobData) => {
    try {
      const response = await fetch(`/api/jobs?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        fetchJobs()
        setEditingJob(null)
        setShowForm(false)
        toast({
          title: "Success",
          description: "Job application updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update job application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating job:", error)
      toast({
        title: "Error",
        description: "Failed to update job application",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchJobs()
        toast({
          title: "Success",
          description: "Job application deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete job application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job application",
        variant: "destructive",
      })
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const filteredJobs =
    activeFilter === "all" ? jobs : jobs.filter((job) => job.status.toLowerCase() === activeFilter.toLowerCase())

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground mt-1">Manage your job applications</p>
        </div>
        <Button
          onClick={() => {
            setEditingJob(null)
            setShowForm(!showForm)
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {showForm ? "Cancel" : "Add New Application"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <JobForm
            onSubmit={editingJob ? (data) => handleUpdateJob(editingJob._id, data) : handleAddJob}
            initialData={editingJob}
          />
        </div>
      )}

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="offer">Offer</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={activeFilter}>
          <JobList
            jobs={filteredJobs}
            isLoading={isLoading}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            onStatusUpdate={(id, status) => handleUpdateJob(id, { status })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
