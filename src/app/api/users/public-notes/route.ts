import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import "@/models/userModel"; // ✅ SIDE-EFFECT IMPORT (IMPORTANT)

connect();

export async function GET() {
  try {
    const notes = await Note.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username email avatar",
      })
      .select("_id title content createdAt user");

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error: any) {
    console.error("PUBLIC NOTES ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
