'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaTag , FaSpinner } from "react-icons/fa";
import ItemPopup from "./item/page1";
import ProfilePopup from "./profile/page1";
import NoItem from "./noItem/page1";
import { motion } from "framer-motion";

export default function PlantSystemHomepage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("plants");
  const [sortOption, setSortOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  let email = localStorage.getItem("email");
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchItems();
    fetchWishlist();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/");
      const allItems = response.data;
      setItems(allItems);
      setFilteredItems(allItems.filter(item => item.category === "plants"));
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false); 
    }
  };

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:8000/${userId}/wishlist/ids`);
      setWishlist(response.data.wishListIds); 
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const filterItems = (category) => {
    setSelectedCategory(category);
    applyFilters(category, sortOption, searchQuery);
  };

  const sortItems = (items, option) => {
    if (option === "price") {
      return [...items].sort((a, b) => a.price - b.price);
    } else if (option === "price-desc") {
      return [...items].sort((a, b) => b.price - a.price);
    } else if (option === "rating") {
      return [...items].sort((a, b) => b.average_rating - a.average_rating);
    } else if (option === "rating-asc") {
      return [...items].sort((a, b) => a.average_rating - b.average_rating);
    }
    return items;
  };

  const applyFilters = (category, sortOption, searchQuery) => {
    let filtered = items.filter(item => item.category === category);
    if (searchQuery) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredItems(sortItems(filtered, sortOption));
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    applyFilters(selectedCategory, option, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    applyFilters(selectedCategory, sortOption, query);
  };

  // whishlist handeling code

  const toggleWishlist = async (itemId) => {
    if (!userId) return alert("Please log in first!");

    //check if wishlist contains items in user list of wishlist
    if(wishlist.includes(itemId)){
      //if it contains then remove it from user list of wishlist

      try{
        //update wishlist in database
        await axios.delete(`http://localhost:8000/${userId}/wishlist/${itemId}`);
        
       //update localy
       let updatedWishlist=wishlist.filter(id => id !== itemId) // Remove item
       setWishlist(updatedWishlist);
      }
      catch(err){
        console.log( "api contains error like:-"+err);
      }
      
      
    }
    else{

      //if it not contains then add it into user list of wishlist
      try{ 
      //update wishlist in database
      await axios.post(`http://localhost:8000/${userId}/wishlist/${itemId}`);

       //update localy
      let updatedWishlist=[...wishlist, itemId] // Remove item
       setWishlist(updatedWishlist);
      }
      catch(err){
        console.log( "api contains error like:-"+err);
      }
      
    }


    

    
  };




  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <header className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
        <div className="flex items-center space-x-2 border p-2 rounded-md bg-gray-100 w-1/3">
          <FaSearch className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search for plants, seeds..." 
            className="bg-transparent outline-none w-full text-gray-700" 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
        </div>
        <nav className="flex space-x-6">
          {["Wishlist", "Buylist" , "Selllist", "Orders", "MyProfile"].map(option => (
            <button key={option} className="text-gray-700 hover:text-blue-600 font-semibold flex items-center space-x-2 relative" onClick={() => {
                if (option === "MyProfile") {
                  setIsProfilePopupOpen(true);
                }
              }}>
              {option === "Wishlist" && <FaHeart className="text-red-500" />}
              {option === "Orders" && <FaShoppingCart className="text-yellow-500" />}
              {option === "MyProfile" && <FaUser className="text-purple-500" />}
              {(option === "Buylist" || option === "Selllist") && <FaTag className="text-blue-500" />}
              <span>{option}</span>
            </button>
          ))}
        </nav>
      </header>
      
      <div className="flex justify-center space-x-6 mt-6">
        {["plants", "seeds", "accessories"].map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-300 text-md ${selectedCategory === category ? "bg-blue-600" : "bg-gray-500 hover:bg-blue-500"}`}
            onClick={() => filterItems(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <select
          className="border p-2 rounded-md bg-white shadow-md text-gray-700"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
        </select>
      </div>

      <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-20 mt-6 px-4">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <p className="ml-2 text-blue-500">Loading items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 p-6 w-96 h-auto relative overflow-hidden"
              onClick={() => setSelectedItemId(item._id)}
            >
              <div className="relative w-full h-56 rounded-2xl overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  className={`absolute top-3 right-3 p-3 rounded-full shadow-md border-2 transition duration-300
                  ${wishlist.includes(item._id) ? "bg-red-500 text-white border-red-500 hover:bg-white hover:text-black transition duration-300 " : "bg-white text-black border-white hover:bg-red-500 hover:text-white transition duration-300"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item._id);
                  }}
                >
                  ❤
                </button>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-900 truncate">{item.name}</h3>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <p className="text-blue-600 font-bold text-xl">${item.price}</p>
                <p className="text-yellow-500 font-semibold flex items-center">
                  ⭐ {item.average_rating}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoItem />
        )}
      </div>


      {selectedItemId && <ItemPopup itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />}
    </div>



    {isProfilePopupOpen && <ProfilePopup userId={userId} onClose={() => setIsProfilePopupOpen(false)} />}
    </div>
  );
}
