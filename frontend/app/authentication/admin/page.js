'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function AdminAuth() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!adminId || !password) {
      alert("Please enter both Admin ID and Password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/test", {
        admin_id: adminId,
        admin_password: password,
      });
      if(response.data.correct){
        localStorage.setItem("adminId", adminId);
        Router.push("/admin");
      }
      else{
        alert("Invalid credentials. Please try again.");
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-100 bg-[url('/background.jpg')] bg-cover bg-center">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
          <FaSpinner className="animate-spin text-green-600 text-4xl mb-3" />
          <p className="text-lg text-gray-700 font-medium">Logging in...</p>
        </div>
      )}

      <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">🌿 Admin Login</h2>
        <p className="text-center text-gray-600 mb-4">Welcome back! Please enter your credentials.</p>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Admin ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">
          Forgot password? <a href="#" className="text-green-600 hover:underline">Reset here</a>
        </p>
      </div>
    </div>
  );
}
