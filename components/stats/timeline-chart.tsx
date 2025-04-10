"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"

export function TimelineChart({ jobs }) {
  // Generate last 6 months
  const today = new Date()
  const sixMonthsAgo = subMonths(today, 5)

  const months = eachMonthOfInterval({
    start: startOfMonth(sixMonthsAgo),
    end: endOfMonth(today),
  })

  // Initialize data with all months
  const data = months.map((month) => {
    const monthName = format(month, "MMM")
    return {
      name: monthName,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    }
  })

  // Count jobs by month and status
  jobs.forEach((job) => {
    const jobDate = new Date(job.applicationDate)
    const monthName = format(jobDate, "MMM")

    const monthData = data.find((d) => d.name === monthName)
    if (monthData) {
      const status = job.status.toLowerCase()
      if (status === "applied") monthData.applied++
      else if (status === "interview") monthData.interview++
      else if (status === "offer") monthData.offer++
      else if (status === "rejected") monthData.rejected++
    }
  })

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="applied" stroke="#3b82f6" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="interview" stroke="#f59e0b" />
        <Line type="monotone" dataKey="offer" stroke="#10b981" />
        <Line type="monotone" dataKey="rejected" stroke="#ef4444" />
      </LineChart>
    </ResponsiveContainer>
  )
}
