'use client';
import { useState } from "react";
import axios from "axios";

export default function UserAuth() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    profileImage: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email: userId,
        password: password,
      });
      localStorage.setItem("email",userId);
      localStorage.setItem("userId",response.data.userId);
      alert(response.data.userId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    let imageUrl = "";

    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "xtf3nszf");
      data.append("cloud_name", "da3airmpg");

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/da3airmpg/image/upload", {
          method: "POST",
          body: data,
        });
        const imgData = await res.json();
        imageUrl = imgData.url;
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }

    try {
      const response = await axios.post("http://localhost:8000/register", {
        ...formData,
        profileImage: imageUrl,
      });
      alert(response.data.message);
      localStorage.setItem("email",formData["email"]);
      localStorage.setItem("userId",response.data.userId);
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-100 bg-[url('/background.jpg')] bg-cover bg-center">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 w-full max-w-md transform transition duration-500 hover:scale-105 animate-fade-in">
        {isRegister ? (
          <>
            <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">🌟 Register</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="text" name="address" placeholder="Address" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="tel" name="phone" placeholder="Phone" required onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <p className="text-center text-gray-500 mt-4 text-sm">Already have an account? <span onClick={() => setIsRegister(false)} className="text-blue-600 hover:underline cursor-pointer">Login here</span></p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">👤 User Login</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
              <input type="text" placeholder="User Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Login</button>
            </form>
            <p className="text-center text-gray-500 mt-4 text-sm">Don't have an account? <span onClick={() => setIsRegister(true)} className="text-blue-600 hover:underline cursor-pointer">Register here</span></p>
          </>
        )}
      </div>
    </div>
  );
}
