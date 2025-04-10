"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function CompanyChart({ jobs }) {
  // Count applications by company
  const companyCounts = jobs.reduce((acc, job) => {
    const company = job.company
    acc[company] = (acc[company] || 0) + 1
    return acc
  }, {})

  // Sort and take top 10
  const sortedCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sortedCompanies} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Applications" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
