import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import cloudinary from "../../../../../lib/cloudinary";

connect();

export async function PATCH(req: NextRequest) {
  try {
    // ✅ SAME AUTH AS /me
    const userId = await getDataFromToken(req);

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const file = formData.get("avatar") as File | null;

    const updates: any = {};

    if (name) updates.name = name;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "avatars" }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      updates.avatar = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    return NextResponse.json({ data: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
