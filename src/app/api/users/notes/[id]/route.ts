import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

/* =======================
   GET SINGLE NOTE
   (public OR owner)
======================= */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    let userId: string | null = null;
    try {
      userId = getDataFromToken(request);
    } catch {
      userId = null;
    }

    const note = await Note.findOne({
      _id: id,
      $or: [
        { isPublic: true },
        { user: userId },
      ],
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   UPDATE NOTE (TITLE/CONTENT)
======================= */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = getDataFromToken(request);
    const { title, content } = await request.json();

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content },
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE NOTE
======================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = getDataFromToken(request);

    const note = await Note.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   PATCH (PIN / PUBLIC)
======================= */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = getDataFromToken(request);
    const body = await request.json();

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      body,
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}