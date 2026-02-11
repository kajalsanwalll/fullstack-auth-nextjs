import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

// CREATE NOTE
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { title, content, images = [] } = await request.json();

    const note = await Note.create({
      title,
      content,
      images,
      user: userId,
    });

    return NextResponse.json({ success: true, data: note });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}



// ✅ GET ALL NOTES FOR DASHBOARD
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const notes = await Note.find({ user: userId }) // 🔥 FIX
      .sort({ isPinned: -1, createdAt: -1 });

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