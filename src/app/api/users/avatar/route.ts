import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function PATCH(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { avatar } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
