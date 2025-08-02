import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path based on where you put the file

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters for future extensibility
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      take: limit, // Use the limit parameter
    });

    return NextResponse.json({
      success: true,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error fetching videos",
      },
      { status: 500 }
    );
  }
}
