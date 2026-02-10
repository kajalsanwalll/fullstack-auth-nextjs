import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/userModel";
import dbConnect from "./dbConnect";

export async function getUserFromToken() {
  try {
    await dbConnect();

    // ✅ cookies() is async in newer Next.js
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded: any = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    );

    const user = await User.findById(decoded.id).select("-password");

    return user;
  } catch (error) {
    return null;
  }
}
