import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { auth } from "@clerk/nextjs/server"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"

// MongoDB connection
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
const dbName = "student-job-tracker"
const collectionName = "jobs"

async function getCollection() {
  await client.connect()
  const db = client.db(dbName)
  return db.collection(collectionName)
}

// GET overview data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      const { userId: authUserId } = auth()
      if (!authUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const collection = await getCollection()
    const jobs = await collection.find({ userId: userId || auth().userId }).toArray()

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

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching overview data:", error)
    return NextResponse.json({ error: "Failed to fetch overview data" }, { status: 500 })
  }
}
