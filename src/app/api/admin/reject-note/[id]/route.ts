import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/noteModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    note.isApproved = false;
    note.isPublic = false; // optional: remove from public request
    await note.save();

    return NextResponse.json({
      success: true,
      message: "Note rejected successfully",
    });

  } catch (error: any) {
    console.error("REJECT ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
