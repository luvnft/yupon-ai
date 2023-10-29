import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import UserInfo from "@/models/userInfo.js";
import dbConnect from "@/utils/dbConnect";

export async function POST(request) {
  const { user } = await getSession();
  const { business_name, description, address, category } =
    await request.json();

  await dbConnect();

  const existingUserInfo = await UserInfo.findOne({ email: user.email });

  if (existingUserInfo) {
    return NextResponse.json({ error: "User information already exists" });
  }

  const userInfo = new UserInfo({
    email: user.email,
    business_name,
    description,
    address,
    category,
  });
  const savedUserInfo = await userInfo.save();

  return NextResponse.json({
    message: "User information saved successfully",
    data: savedUserInfo,
  });
}

export async function GET() {
  const { user } = await getSession();

  await dbConnect();

  const existingUserInfo = await UserInfo.findOne({ email: user.email });

  if (!existingUserInfo) {
    return NextResponse.json({ error: "User information not found" });
  }

  return NextResponse.json({
    message: "User information retrieved successfully",
    data: existingUserInfo,
  });
}
