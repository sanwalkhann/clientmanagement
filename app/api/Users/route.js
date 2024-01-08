import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import User from "@/app/(models)/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;
    console.log(userData);
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { messages: "all fields required" },
        { status: 400 }
      );
    }
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json(
        { messages: "Duplicate Email" },
        { status: 409 }
      );
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    await User.create(userData);
    return NextResponse.json({ messages: "User Created" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
