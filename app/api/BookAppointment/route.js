// pages/api/book-appointment.js
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import Patient from "@/app/(models)/Patient";
import Appointment from "@/app/(models)/BookAppointment";

export async function POST(req) {
  const session = await getSession({ req });

  if (!session) {
    return NextResponse.error("Unauthorized", 401);
  }

  const { userId } = await req.json();  

  try {
    const doctor = await User.findById(userId); 

    if (!doctor) {
      return NextResponse.error("Doctor not found", 404);
    }

    const appointment = new Appointment({
      patientId: session.user._id,
      doctorId: userId,  
      slot: {
        day: "Monday",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
      },
    });

    await appointment.save();

    doctor.bookedAppointments.push(appointment._id);
    await doctor.save();

    const patient = await Patient.findById(session.user._id);
    if (!patient) {
      return NextResponse.error("Patient not found", 404);
    }
    patient.bookedAppointments.push(appointment._id);
    await patient.save();

    return NextResponse.json({ messages: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    return NextResponse.error("Internal Server Error", 500);
  }
}
