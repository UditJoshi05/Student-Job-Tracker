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

// GET recent jobs
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
    const jobs = await collection
      .find({ userId: userId || auth().userId })
      .sort({ applicationDate: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json(
      jobs.map((job) => ({
        ...job,
        _id: job._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching recent jobs:", error)
    return NextResponse.json({ error: "Failed to fetch recent jobs" }, { status: 500 })
  }
}
