"use client"
// pages/ClientMember.js
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ClientMember = () => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin?callbackUrl=/ClientMember");
    },
  });

  const [associatedDoctor, setAssociatedDoctor] = useState(null);

  useEffect(() => {
    const fetchAssociatedDoctor = async () => {
      try {
        const response = await fetch(`/api/doctor/${session.user.associatedDoctorId}`);

        if (response.ok) {
          const data = await response.json();
          setAssociatedDoctor(data);
          console.log("Associated Doctor fetched successfully!", data);
        } else {
          console.error("Error fetching associated doctor:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching associated doctor:", error.message);
      }
    };

    fetchAssociatedDoctor();
  }, [session]);

  return (
    <div>
      <h1>Member Client session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>

      {associatedDoctor && (
        <div>
          <h2>Associated Doctors Information:</h2>
          <p>Name: {associatedDoctor.name}</p>
          <p>Email: {associatedDoctor.email}</p>
        </div>
      )}
    </div>
  );
};

export default ClientMember;
