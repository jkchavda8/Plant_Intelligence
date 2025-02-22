'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function AdminItemPopup({ itemId, onClose, onItemUpdated }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedKey, setExpandedKey] = useState(null);

    useEffect(() => {
        if (itemId) {
            fetchItemDetails(itemId);
        }
    }, [itemId]);

    const fetchItemDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/${id}`);
            setItem(response.data);
        } catch (err) {
            setError("Error fetching item details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        const adminId = localStorage.getItem("adminId");

        if (!adminId) {
            alert("Admin authentication required!");
            return;
        }
        try {
            const newStatus = item.status === "pending" || item.status === "block" ? "approve" : "block";
            await axios.put(`http://localhost:8000/${newStatus === "approve" ? "approve-item" : "block-item"}/${itemId}`);
            setItem({ ...item, status: newStatus });
            onItemUpdated();
        } catch (err) {
            alert("Error updating item status");
        }
    };

    if (!itemId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-red-100 p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
                <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    <FaTimes size={20} />
                </button>

                {loading ? (
                    <p className="text-center text-gray-700">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div>
                        {item.images.length > 0 && (
                            <Carousel showArrows={true} infiniteLoop autoPlay showThumbs={false}>
                                {item.images.map((img, index) => (
                                    <div key={index} className="rounded-lg overflow-hidden">
                                        <img src={img} alt={`Item image ${index + 1}`} className="w-full h-auto max-h-64 object-contain" />
                                    </div>
                                ))}
                            </Carousel>
                        )}

                        <h2 className="text-2xl font-bold mt-4 text-gray-900">{item.name}</h2>
                        <p className="text-gray-700 mt-2">{item.description}</p>
                        <p className="text-blue-600 font-bold text-lg">${item.price}</p>
                        <p className={`font-semibold ${item.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                            {item.stock > 0 ? `In Stock: ${item.stock}` : "Out of Stock"}
                        </p>
                        <p className="text-gray-700 mt-2 font-semibold">Status: {item.status}</p>

                        <div className="bg-gray-50 shadow-md rounded-2xl p-4 mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Points</h3>
                            <div className="divide-y divide-gray-300">
                                {Array.isArray(item.keyPoints) && item.keyPoints.length > 0 ? (
                                    item.keyPoints.map(({ key, description }) => (
                                        <div key={key} className="py-3">
                                            <button
                                                className="flex justify-between items-center w-full text-left text-gray-700 font-medium py-2 px-3 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300"
                                                onClick={() => setExpandedKey(expandedKey === key ? null : key)}
                                            >
                                                <span className="text-gray-900">{key}</span>
                                                {expandedKey === key ? (
                                                    <FaChevronDown className="text-gray-500 transition-transform transform rotate-180" />
                                                ) : (
                                                    <FaChevronRight className="text-gray-500 transition-transform" />
                                                )}
                                            </button>
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={expandedKey === key ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden mt-2 px-3"
                                            >
                                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                                                    {description}
                                                </p>
                                            </motion.div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No key points available.</p>
                                )}
                            </div>
                        </div>

                        <h3 className="font-semibold mt-6 text-lg text-gray-900">Reviews</h3>
                        <div className="mt-2 max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
                            {item.reviewIds.length > 0 ? (
                                item.reviewIds.map((review) => (
                                    <div key={review._id} className="border-b last:border-none py-2">
                                        <p className="text-gray-800 text-sm">{review.comment}</p>
                                        <p className="text-yellow-500 text-sm">⭐ {review.rating}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No reviews yet.</p>
                            )}
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                className={`py-2 px-4 rounded-lg text-white transition-all duration-300 ${
                                    item.status === "pending" || item.status === "block"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                                onClick={handleStatusChange}
                            >
                                {item.status === "pending" || item.status === "block" ? "Approve" : "Block"}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
