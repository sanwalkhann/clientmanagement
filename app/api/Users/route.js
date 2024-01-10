import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/(models)/User";
import Patient from "@/app/(models)/Patient";

export async function POST(req) {
  try {
    const body = await req.json();
    const formData = body;

    if (!formData?.email || !formData.password) {
      return NextResponse.json(
        { messages: "All fields are required" },
        { status: 400 }
      );
    }

    console.log(formData.email);
    const duplicate = await User.findOne({ email: formData.email }) || await Patient.findOne({email: formData.email})
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json(
        { messages: "Duplicate Email" },
        { status: 409 }
      );
    }

    const hashPassword = await bcrypt.hash(formData.password, 10);
    formData.password = hashPassword;
    console.log(formData);
    await User.create(formData);

    return NextResponse.json({ messages: "User Created" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await User.find();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
