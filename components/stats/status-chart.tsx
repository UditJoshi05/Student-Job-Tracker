"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function StatusChart({ jobs }) {
  // Count jobs by status
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Convert to array for chart
  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }))

  const COLORS = {
    Applied: "#3b82f6",
    Interview: "#f59e0b",
    Offer: "#10b981",
    Rejected: "#ef4444",
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#9ca3af"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
