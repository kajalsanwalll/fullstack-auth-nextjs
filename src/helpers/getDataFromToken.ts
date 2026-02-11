import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    );

    return decoded.id;
  } catch {
    throw new Error("Invalid token");
  }
};
