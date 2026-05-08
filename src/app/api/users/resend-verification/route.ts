import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {

    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await sendEmail({
      email: user.email,
      emailType: "VERIFY",
      userId: user._id,
    });

    return NextResponse.json({
      message: "Verification email sent",
      success: true,
    });

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}