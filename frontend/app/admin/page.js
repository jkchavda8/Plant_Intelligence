'use client';

import { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import AdminItemPopup from "./item/page"; // Ensure this matches the correct file path

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/");
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Function to group items by category
  const categorizeItems = (category) => items.filter((item) => item.category === category);

  return (
    <div className="p-6 bg-red-50 min-h-screen"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-700">Admin Of Plant AI</h1>
        <Link 
          href="/admin/reportOrder" 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          View Reported Orders
        </Link>
      </div>

      {loading && <p className="text-gray-700">Loading items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {['plants', 'seeds', 'accessories'].map((category) => {
            const categoryItems = categorizeItems(category);
            return categoryItems.length > 0 ? (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold text-red-800 mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 p-6 cursor-pointer border border-red-100"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-100">
                        <img
                          src={item.images?.[0] || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold mt-4 text-gray-900 truncate">{item.name}</h3>
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-red-600 font-bold text-xl">${item.price}</p>
                        <p className="text-yellow-500 font-semibold flex items-center">
                          ⭐ {item.average_rating || 0}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        By: {item.userId?.name || "N/A"} ({item.userId?.email || "N/A"})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })}

          {selectedItem && (
            <AdminItemPopup
              itemId={selectedItem._id}
              onClose={() => setSelectedItem(null)}
              onItemUpdated={() => {
                setSelectedItem(null);
                window.location.reload(); // Refresh items after update
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
