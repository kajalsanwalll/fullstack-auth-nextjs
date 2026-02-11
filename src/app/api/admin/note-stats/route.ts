import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Note from "@/models/noteModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  try {
    // 🔐 Get logged-in user
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    // 🛑 Only admin allowed
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 📊 Count notes
    const pending = await Note.countDocuments({
      isPublic: true,
      isApproved: false,
      isRejected: false,
    });

    const approved = await Note.countDocuments({
      isPublic: true,
      isApproved: true,
    });

    const rejected = await Note.countDocuments({
      isRejected: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        pending,
        approved,
        rejected,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
