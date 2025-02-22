'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const Router = useRouter();

  const handleNavigation = (path) => {
    setLoading(true);
    Router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-200 to-green-500 text-center p-6">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-75 z-50">
          <FaSpinner className="animate-spin text-green-700 text-4xl mb-3" />
          <p className="text-lg text-gray-700 font-medium">Loading...</p>
        </div>
      )}

      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">🌿 Plant Intelligence System</h1>
      <p className="text-xl text-gray-100 mb-8 max-w-md">
        Welcome to the future of plant monitoring. Choose your role to proceed.
      </p>

      <div className="flex space-x-6">
        <button 
          onClick={() => handleNavigation("/authentication/admin")}
          className="px-8 py-4 bg-white text-green-700 text-lg font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-green-100 disabled:opacity-50"
          disabled={loading}
        >
          Admin Panel
        </button>

        <button 
          onClick={() => handleNavigation("/authentication/user")}
          className="px-8 py-4 bg-green-700 text-white text-lg font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-green-800 disabled:opacity-50"
          disabled={loading}
        >
          User Dashboard
        </button>
      </div>
    </div>
  );
}
