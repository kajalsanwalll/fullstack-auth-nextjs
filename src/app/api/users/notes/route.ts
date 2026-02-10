import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

// CREATE NOTE
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { title, content } = await request.json();

    const note = await Note.create({
      title,
      content,
      user: userId, // ✅ FIX
    });

    return NextResponse.json({ success: true, data: note });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET ALL NOTES
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const notes = await Note.find({ user: userId }) // ✅ FIX
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: notes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
