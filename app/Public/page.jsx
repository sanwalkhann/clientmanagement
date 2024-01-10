"use client"
import { useSession } from "next-auth/react";
// pages/use-client/Public.js
import React, { useEffect, useState } from "react";

const Public = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const {data:session} =useSession()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Users");

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log("Data fetched successfully!", data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleBookAppointment = async (userId) => {
    try {
      if(!session){
        console.log("patient no is")
      }
      const response = await fetch("/api/BookAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
         patientId: session.user.id,
        }),
      });

      if (response.ok) {
        const bookedSlot = await response.json();
        console.log("Appointment booked successfully:", bookedSlot);
        setSelectedUser({ ...user, bookedSlot });
      } else {
        console.error("Error booking appointment:", response.statusText);
      }
    } catch (error) {
      console.error("Error booking appointment:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Public</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-400">Name</th>
            <th className="py-2 px-4 border-b border-gray-400">Email</th>
            <th className="py-2 px-4 border-b border-gray-400">Specialization</th>
            <th className="py-2 px-4 border-b border-gray-400">Time Slots</th>
            <th className="py-2 px-4 border-b border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b border-gray-400">{user.name}</td>
              <td className="py-2 px-4 border-b border-gray-400">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-400">{user.specialization}</td>
              <td className="py-2 px-4 border-b border-gray-400">
                <ul className="list-disc pl-4">
                  {user.timeSlots.map((slot, index) => (
                    <li key={index}>
                      {slot.day} - {slot.startTime} to {slot.endTime}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4 border-b border-gray-400">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleBookAppointment(user._id)}
                >
                  Book Appointment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUser && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <h2 className="text-xl font-semibold mb-2">
            Selected User: {selectedUser.name}
          </h2>
          <p className="mb-2">Selected Users Time Slots:</p>
          <ul className="list-disc pl-4">
            {selectedUser.timeSlots.map((slot, index) => (
              <li key={index}>
                {slot.day} - {slot.startTime} to {slot.endTime}
              </li>
            ))}
          </ul>
          {selectedUser.bookedSlot && (
            <p className="mt-2">Booked Slot: {selectedUser.bookedSlot}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Export the component
export default Public;
