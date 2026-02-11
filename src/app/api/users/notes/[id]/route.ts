import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

/* =======================
   GET SINGLE NOTE
======================= */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    let userId: string | null = null;

    try {
      userId = await getDataFromToken(request);
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

    return NextResponse.json({
      success: true,
      data: note,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   UPDATE NOTE (TITLE / CONTENT)
   ONLY CREATOR CAN EDIT
======================= */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await getDataFromToken(request);
    const { title, content } = await request.json();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // 🔒 SECURITY CHECK
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not allowed to edit this note" },
        { status: 403 }
      );
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    await note.save();

    return NextResponse.json({
      success: true,
      data: note,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE NOTE
   ONLY CREATOR CAN DELETE
======================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await getDataFromToken(request);

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // 🔒 SECURITY CHECK
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not allowed to delete this note" },
        { status: 403 }
      );
    }

    await note.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =======================
   PATCH (PIN / PUBLIC)
   ONLY CREATOR CAN MODIFY
======================= */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = await getDataFromToken(request);
    const body = await request.json();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    // 🔒 SECURITY CHECK
    if (note.user.toString() !== userId) {
      return NextResponse.json(
        { error: "You are not allowed to modify this note" },
        { status: 403 }
      );
    }

    Object.assign(note, body);

    await note.save();

    return NextResponse.json({
      success: true,
      data: note,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
