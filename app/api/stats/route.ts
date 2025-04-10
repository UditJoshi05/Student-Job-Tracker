import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { auth } from "@clerk/nextjs/server"

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

// GET job stats
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

    // Calculate stats
    const stats = {
      total: jobs.length,
      applied: jobs.filter((job) => job.status === "Applied").length,
      interview: jobs.filter((job) => job.status === "Interview").length,
      offer: jobs.filter((job) => job.status === "Offer").length,
      rejected: jobs.filter((job) => job.status === "Rejected").length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
