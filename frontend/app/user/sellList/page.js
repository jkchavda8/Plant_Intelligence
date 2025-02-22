'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTag, FaEdit , FaPlus , FaTimes , FaSpinner } from "react-icons/fa";
import ItemPopup from "../item/page1";
import NoItem from "../noItem/page1";

export default function PlantSystemHomepage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "plants",
    stock: 1,
    images: [],
    keyPoints: [{ key: "", description: "" }],
  });
  const [imageFiles, setImageFiles] = useState([]);
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/");
      const allItems = response.data;
      setItems(allItems);
      setFilteredItems(allItems.filter(item => String(item.userId._id) === userId));
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    let filtered = items.filter(item => String(item.userId._id) === userId);
    if (query.length > 0) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    }
    setFilteredItems(filtered);
  };


  const handleAddItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
      alert("All fields except key points are required!");
      return;
    }
    if (newItem.stock < 1) {
      alert("Stock must be at least 1!");
      return;
    }

    setIsLoading(true);
    let uploadedImages = [];
    for (let imageFile of imageFiles) {
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
        uploadedImages.push(imgData.url);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }

    try {
      await axios.post("http://localhost:8000/storeItem", {
        ...newItem,
        userId,
        images: uploadedImages,
      });
      fetchItems();
      setShowAddItemPopup(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        category: "plants",
        stock: 1,
        images: [],
        keyPoints: [],
      });
      setImageFiles([]);
      alert("Your item request will be verified soon.")
    } catch (error) {
      console.error("Error adding item", error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem || newStock <= 0) {
      alert("Stock must be greater than zero!");
      return;
    }
    try {
      await axios.put(`http://localhost:8000/item/${editItem._id}`, {
        price: newPrice,
        stock: newStock,
      });
      fetchItems();
      setEditItem(null);
      setNewPrice("");
      setNewStock("");
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  const addKeyPoint = () => {
    setNewItem({
      ...newItem,
      keyPoints: [...newItem.keyPoints, { key: "", description: "" }],
    });
  };

  const removeKeyPoint = (index) => {
    const updatedKeyPoints = [...newItem.keyPoints];
    updatedKeyPoints.splice(index, 1);
    setNewItem({ ...newItem, keyPoints: updatedKeyPoints });
  };


  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center px-6">
      {/* Header with Search */}
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
          <span>Sell List</span>
        </button>
      </div>

      {/* Items List */}
      <div className="w-full max-w-5xl mt-10 flex flex-col space-y-4">
        { loading ? (
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
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition" onClick={() => { setEditItem(item); setNewPrice(item.price); setNewStock(item.stock); }}>
                  <FaEdit /> <span>Edit</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <NoItem />
        )}
      </div>

      {/* Edit Item Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-gray-800">Edit Item</h2>
            <label className="block mt-4">Price:</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            <label className="block mt-4">Stock:</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded" value={newStock} onChange={(e) => setNewStock(e.target.value)} />
            <div className="flex justify-end mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleUpdateItem}>Update</button>
              <button className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {selectedItemId && <ItemPopup itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />}


        {/* Add Item Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={() => setShowAddItemPopup(true)}
      >
        <FaPlus size={24} />
      </button>

      {/* Add Item Modal */}
      {showAddItemPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4 relative">
            {/* Close Button */}
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setShowAddItemPopup(false)}>
              <FaTimes />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800">Add New Item</h2>
            <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required />
            <textarea placeholder="Description" className="w-full p-2 border rounded" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} required></textarea>
            <input type="number" placeholder="Price" className="w-full p-2 border rounded" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} required />
            
            {/* Category Dropdown */}
            <select className="w-full p-2 border rounded" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} required>
              <option value="">Select Category</option>
              <option value="plants">Plants</option>
              <option value="seeds">Seeds</option>
              <option value="otherAccessories">Other Accessories</option>
            </select>
            
            {/* Image Upload */}
            <input 
              type="file" 
              multiple 
              className="w-full p-2 border rounded" 
              onChange={(e) => setImageFiles([...e.target.files])} 
              required 
            />

            
            {newItem.keyPoints.map((kp, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="text" placeholder="Key" className="p-2 border rounded w-1/2" value={kp.key} onChange={(e) => {
                  const updatedKeyPoints = [...newItem.keyPoints];
                  updatedKeyPoints[index].key = e.target.value;
                  setNewItem({ ...newItem, keyPoints: updatedKeyPoints });
                }} />
                <input type="text" placeholder="Description" className="p-2 border rounded w-1/2" value={kp.description} onChange={(e) => {
                  const updatedKeyPoints = [...newItem.keyPoints];
                  updatedKeyPoints[index].description = e.target.value;
                  setNewItem({ ...newItem, keyPoints: updatedKeyPoints });
                }} />
                <button onClick={() => removeKeyPoint(index)} className="text-red-500"><FaTimes /></button>
              </div>
            ))}
            <button className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={addKeyPoint}>+ Add Key Point</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center" onClick={handleAddItem} disabled={isLoading}>
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : "Add Item"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
