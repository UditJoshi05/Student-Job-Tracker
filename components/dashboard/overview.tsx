"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function Overview({ userId }) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/overview?userId=${userId}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching overview data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Your application activity over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">Loading...</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your application activity over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applied" name="Applied" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interview" name="Interview" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offer" name="Offer" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
