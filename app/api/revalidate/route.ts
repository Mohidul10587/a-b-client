// app/api/revalidate/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ message: "Path is required" }, { status: 400 });
  }

  try {
    return NextResponse.json({ message: `Revalidated path: ${path}` });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    );
  }
}
