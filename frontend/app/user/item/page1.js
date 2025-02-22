import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaChevronRight, FaChevronDown, FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ItemPopup({ itemId, onClose }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [buying, setBuying] = useState(false);
  const userId = localStorage.getItem('userId');

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

  const handleBuyNow = async () => {
    if (!item || !userId) return;
    setBuying(true);
    const totalAmount = quantity * item.price;

    try {
      await axios.post("http://localhost:8000/order", {
        userId,
        itemId: item._id,
        quantity,
        totalAmount,
      });

      const updatedStock = item.stock - quantity;
      await axios.patch(`http://localhost:8000/${item._id}/stock`, { stock: updatedStock });

      setItem((prev) => ({ ...prev, stock: updatedStock }));
      setQuantity(1);
      alert("Order placed successfully!");
    } catch (err) {
      alert("Error placing order. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  if (!itemId) return null;

  // Function to handle quantity change
  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < item.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-[500px] max-h-[90vh] overflow-y-auto relative"
      >
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
          <FaTimes size={20} />
        </button>

        {/* Loading & Error Handling */}
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div>
            {/* Item Image */}
            <img src={item.images[0]} alt={item.name} className="w-full h-auto max-h-64 object-contain rounded-md" />

            {/* Item Details */}
            <h2 className="text-2xl font-bold mt-4 text-gray-900">{item.name}</h2>
            <p className="text-gray-700 mt-2">{item.description}</p>

            {/* Price & Stock */}
            <div className="flex justify-between items-center mt-4">
              <p className="text-blue-600 font-bold text-lg">${item.price}</p>
              <p className={`font-semibold ${item.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {item.stock > 0 ? `In Stock: ${item.stock}` : "Out of Stock"}
              </p>
            </div>

            {/* Key-Value Pair Section */}
            <div className="bg-white shadow-md rounded-2xl p-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Key Points</h3>
              <div className="divide-y divide-gray-300">
              {(item.keyPoints || []).map((point, index) => (
                <div key={index} className="py-3">
                  <button
                    className="flex justify-between items-center w-full text-left text-gray-700 font-medium py-2 px-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    onClick={() => setExpandedKey(expandedKey === index ? null : index)}
                  >
                    <span className="text-gray-900">{point.key}</span>
                    {expandedKey === index ? (
                      <FaChevronDown className="text-gray-500 transition-transform transform rotate-180" />
                    ) : (
                      <FaChevronRight className="text-gray-500 transition-transform" />
                    )}
                  </button>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={expandedKey === index ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden mt-2 px-3"
                  >
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                      {point.description}
                    </p>
                  </motion.div>
                </div>
              ))}

              </div>
            </div>

            {/* Reviews Section */}
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

            {item.stock > 0 && userId != String(item.userId._id) && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Buy Now</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full disabled:opacity-50"
                      disabled={quantity === 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="text-lg font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full disabled:opacity-50"
                      disabled={quantity >= item.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-blue-600">${(item.price * quantity).toFixed(2)}</p>
                </div>
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                  onClick={handleBuyNow}
                  disabled={buying}
                >
                  {buying ? "Processing..." : "Buy Now"}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
