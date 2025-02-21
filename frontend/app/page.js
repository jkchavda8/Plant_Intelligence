import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-200 to-green-500 text-center p-6">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">🌿 Plant Intelligence System</h1>
      <p className="text-xl text-gray-100 mb-8 max-w-md">
        Welcome to the future of plant monitoring. Choose your role to proceed.
      </p>
      <div className="flex space-x-6">
        <Link href="/authentication/admin" className="px-8 py-4 bg-white text-green-700 text-lg font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-green-100">
          Admin Panel
        </Link>
        <Link href="/authentication/user" className="px-8 py-4 bg-green-700 text-white text-lg font-bold rounded-2xl shadow-lg transform transition hover:scale-105 hover:bg-green-800">
          User Dashboard
        </Link>
      </div>
    </div>
  );
}