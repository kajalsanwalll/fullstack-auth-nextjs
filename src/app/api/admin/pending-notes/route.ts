import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/noteModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const notes = await Note.find({
      isPublic: true,
      isApproved: false,
      isRejected: false,
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email avatar");

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
