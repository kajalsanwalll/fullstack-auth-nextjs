import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const user = await User.findById(userId)
      .select("-password -isAdmin");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User found!",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 } // 🔥 THIS IS THE IMPORTANT FIX
    );
  }
}
