import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
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

// GET all jobs for a user
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
      .toArray()

    return NextResponse.json(
      jobs.map((job) => ({
        ...job,
        _id: job._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// POST new job
export async function POST(request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobData = await request.json()

    // Validate required fields
    if (!jobData.company || !jobData.role || !jobData.status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const collection = await getCollection()
    const result = await collection.insertOne({
      ...jobData,
      userId: jobData.userId || userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Job added successfully",
        id: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding job:", error)
    return NextResponse.json({ error: "Failed to add job" }, { status: 500 })
  }
}

// PUT update job
export async function PUT(request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const jobData = await request.json()
    const collection = await getCollection()

    // Remove _id from update data if present
    if (jobData._id) {
      delete jobData._id
    }

    // Verify ownership
    const job = await collection.findOne({ _id: new ObjectId(id) })
    if (!job || job.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized or job not found" }, { status: 403 })
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...jobData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job updated successfully" })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

// DELETE job
export async function DELETE(request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const collection = await getCollection()

    // Verify ownership
    const job = await collection.findOne({ _id: new ObjectId(id) })
    if (!job || job.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized or job not found" }, { status: 403 })
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
