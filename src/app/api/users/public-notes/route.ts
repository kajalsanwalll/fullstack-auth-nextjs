import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";

connect();

export async function GET() {
  try {
    const notes = await Note.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select("_id title content createdAt");

    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
