"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";


const UserForm = () => {
  const router = useRouter();

  const getToday = () => {
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(today);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    timeSlots: [{ day: getToday(), startTime: "", endTime: "" }],
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
      timeSlots: [
        ...prevState.timeSlots,
        { day: getToday(), startTime: "", endTime: "" },
      ],
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prevState) => {
      const updatedTimeSlots = [...prevState.timeSlots];
      updatedTimeSlots.splice(index, 1);
      return { ...prevState, timeSlots: updatedTimeSlots };
    });
  };

  const isValidTimeSlot = (timeSlot) => {
    return (
      timeSlot.day === getToday() &&
      timeSlot.startTime !== "" &&
      timeSlot.endTime !== ""
    );
  };

  const specializationOptions = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Hematologist",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.specialization ||
      formData.timeSlots.length === 0
    ) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    if (!formData.timeSlots.every(isValidTimeSlot)) {
      setErrorMessage("Invalid time slots. Ensure day, start time, and end time are provided.");
      return;
    }
  
    const formattedTimeSlots = formData.timeSlots.map((timeSlot) => ({
      day: timeSlot.day,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
    }));
  
    console.log(formattedTimeSlots)

    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        timeSlots: formattedTimeSlots,  
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res)
  
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.messages);  
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
        <select
          id="specialization"
          name="specialization"
          onChange={handleChange}
          value={formData.specialization}
          required
        >
          <option value="" disabled>Select specialization</option>
          {specializationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <label>Time Slots</label>
        {formData.timeSlots.map((timeSlot, index) => (
          <div key={index} className="time-slot">
            <label>Day</label>
            <p>{timeSlot.day}</p>
            <label>Start Time</label>
            <input
              type="time"
              value={timeSlot.startTime}
              onChange={(e) => handleTimeSlotChange(index, "startTime", e.target.value)}
              required
            />
            <label>End Time</label>
            <input
              type="time"
              value={timeSlot.endTime}
              onChange={(e) => handleTimeSlotChange(index, "endTime", e.target.value)}
              required
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

