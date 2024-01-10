// pages/api/Patient.js
import Patient from "@/app/(models)/Patient";
import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const body = await req.json();
    const data = body.formData;

    const existingUser = await Patient.findOne({ email: data.email }) || await User.findOne({email: data.email});
    if (existingUser) {
      return NextResponse.json(
        { messages: "User Already Exists" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;

    await Patient.create(data);

    return NextResponse.json({ messages: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error registering patient:", error.message);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
