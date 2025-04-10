import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// This route is for testing MongoDB connection
export async function GET() {
  try {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      return NextResponse.json({ error: "MongoDB URI is not configured" }, { status: 500 })
    }

    const client = new MongoClient(uri)
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    await client.close()

    return NextResponse.json({
      status: "success",
      message: "Connected to MongoDB successfully",
    })
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to MongoDB",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
