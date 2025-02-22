'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTag, FaEdit, FaPlus, FaTimes, FaSpinner, FaStar } from "react-icons/fa";
import ItemPopup from "../item/page1";
import NoItem from "../noItem/page1";

export default function PlantSystemHomepage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewItemId, setReviewItemId] = useState(null);
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/${userId}/buyList`);
      const allItems = response.data.buyList;
      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setFilteredItems(
      query.length > 0
        ? items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
        : items
    );
  };

  const submitReview = async () => {
    if (!rating || !reviewText) {
      alert("Both rating and review are required!");
      return;
    }
    try {
      await axios.post("http://localhost:8000/addReview", {
        itemId: reviewItemId,
        userId,
        rating,
        comment: reviewText,
      });
      alert("Review submitted successfully!");
      setReviewModal(false);
      fetchItems();
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center px-6">
      <div className="w-full max-w-7xl mt-8 flex flex-col sm:flex-row justify-between items-center bg-blue-100 shadow-lg p-4 rounded-xl">
        <h1 className="text-3xl font-bold text-blue-800">🌱 Plant Marketplace</h1>
        <div className="relative w-full sm:w-1/2 mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search for plants..."
            className="w-full p-3 pl-10 rounded-lg border border-blue-300 shadow-sm outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FaSearch className="absolute left-3 top-3 text-blue-500" />
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition">
          <FaTag />
          <span>Buy List</span>
        </button>
      </div>

      <div className="w-full max-w-5xl mt-10 flex flex-col space-y-4">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <p className="ml-2 text-blue-500">Loading items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-transform transform hover:scale-[1.02] cursor-pointer flex items-center p-4">
              <div className="w-40 h-40 bg-gray-200 overflow-hidden flex-shrink-0" onClick={() => setSelectedItemId(item._id)}>
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
              </div>
              <div className="flex-grow ml-6">
                <h3 className="text-2xl font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-blue-600 font-bold text-lg">${item.price}</p>
                  <p className="text-yellow-500 font-semibold">⭐ {item.average_rating}</p>
                </div>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition" onClick={() => { setReviewModal(true); setReviewItemId(item._id); }}>
                  <FaEdit /> <span>Add Review</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoItem />
        )}
      </div>

      {selectedItemId && <ItemPopup itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />}

      {reviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setReviewModal(false)}>
                <FaTimes className="text-2xl" />
            </button>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 text-center">Add Review</h2>
            <textarea className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-blue-400" placeholder="Write your review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            <div className="flex justify-center mb-4 space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={`cursor-pointer text-3xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`} onClick={() => setRating(star)} />
                ))}
            </div>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition" onClick={submitReview}>Submit Review</button>
            </div>
        </div>
      )}
    </div>
  );
}
