"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PatientForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch("/api/Patients", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "content-type": "application/json",
    });
    console.log(res);
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    }else {
      router.refresh();
      router.push("/api/auth/signin");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Patient Registration</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="name" className="mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md mb-4"
        />

        <label htmlFor="email" className="mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md mb-4"
        />

        <label htmlFor="password" className="mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default PatientForm;
