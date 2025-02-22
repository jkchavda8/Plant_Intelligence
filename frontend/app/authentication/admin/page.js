'use client';
import { useState } from "react";
import axios from "axios";

export default function AdminAuth() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Admin ID:", adminId);
    console.log("Password:", password);
    
    try {
      const response = await axios.post("http://localhost:8000/test", {
        admin_id: adminId,
        admin_password: password,
      });
      localStorage.setItem("adminId",adminId);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-100 bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 w-full max-w-md transform transition duration-500 hover:scale-105 animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">🌿 Admin Login</h2>
        <p className="text-center text-gray-600 mb-4">Welcome back! Please enter your credentials.</p>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Admin ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">Forgot password? <a href="#" className="text-green-600 hover:underline">Reset here</a></p>
      </div>
    </div>
  );
}
