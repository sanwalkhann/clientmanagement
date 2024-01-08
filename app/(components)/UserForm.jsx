"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    timeSlots: [{ day: "", startTime: "", endTime: "" }],
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData((prevState) => {
      const updatedTimeSlots = [...prevState.timeSlots];
      updatedTimeSlots[index][field] = value;
      return { ...prevState, timeSlots: updatedTimeSlots };
    });
  };

  const handleAddTimeSlot = () => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlots: [...prevState.timeSlots, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevState) => {
      const updatedTimeSlots = [...prevState.timeSlots];
      updatedTimeSlots.splice(index, 1);
      return { ...prevState, timeSlots: updatedTimeSlots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col">
        <h1>Create</h1>
        <label>Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <label>Email</label>
        <input
          id="email"
          name="email"
          type="text"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <label>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <label>Specialization</label>
        <input
          id="specialization"
          name="specialization"
          type="text"
          onChange={handleChange}
          value={formData.specialization}
          required
        />
        <label>Time Slots</label>
        {formData.timeSlots.map((timeSlot, index) => (
          <div key={index}>
            <label>Day</label>
            <input
              type="text"
              value={timeSlot.day}
              onChange={(e) => handleTimeSlotChange(index, "day", e.target.value)}
            />
            <label>Start Time</label>
            <input
              type="text"
              value={timeSlot.startTime}
              onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
            />
            <label>End Time</label>
            <input
              type="text"
              value={timeSlot.endTime}
              onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveTimeSlot(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddTimeSlot}>
          Add Time Slot
        </button>
        <button type="submit">Submit</button>
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};

export default UserForm;
