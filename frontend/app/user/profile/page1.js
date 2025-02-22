'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ProfilePopup({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/profile/${userId}`);
      setUser(response.data);
      setFormData({ name: response.data.name, address: response.data.address, phone: response.data.phone });
    } catch (err) {
      setError("Failed to fetch user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`http://localhost:8000/profile/${userId}`, formData);
      fetchUserProfile();
      alert("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-96 relative"
      >
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition" onClick={onClose}>
          ✖
        </button>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">User Profile</h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
