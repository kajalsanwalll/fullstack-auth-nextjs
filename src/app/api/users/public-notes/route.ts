import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import "@/models/userModel";

connect();

export async function GET() {
  try {
    const notes = await Note.find({
      isPublic: true,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "username email avatar",
        options: { strictPopulate: false },
      })
      .select("_id title content createdAt user");

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
