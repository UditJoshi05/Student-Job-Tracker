"use client"

import { JobCard } from "@/components/job-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobList({ jobs, isLoading, onEdit, onDelete, onStatusUpdate }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-10 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No applications found</CardTitle>
          <CardDescription>Add your first job application to get started</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onEdit={() => onEdit(job)}
          onDelete={() => onDelete(job._id)}
          onStatusUpdate={(status) => onStatusUpdate(job._id, status)}
        />
      ))}
    </div>
  )
}
