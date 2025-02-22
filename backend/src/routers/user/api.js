const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const User = require("../../models/user");
const Item = require("../../models/item")

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address, phone , profileImage } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('here')
    const newUser = new User({ name, email, password: hashedPassword, address, phone,profileImage, wishList: [], buyList: [], sellList: [] });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" , userId: newUser._id  });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user._id }, "check", { expiresIn: "1h" });
    // console.log('here')
    res.json({ token, user , userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get User Profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update User
router.put("/profile/:id", async (req, res) => {
    try {
      const { name, address, phone, profileImage } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, address, phone, profileImage }
      );
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
});
  
  // Delete User
router.delete("/profile/:id", async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
});

// Add item to wishlist
router.post("/:userId/wishlist/:itemId", async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });
        
        if (user.wishList.includes(itemId)) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }
        
        user.wishList.push(itemId);
        await user.save();
        
        res.json({ message: "Item added to wishlist", wishList: user.wishList });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Remove item from wishlist
router.delete("/:userId/wishlist/:itemId", async (req, res) => {
    try {
        const { userId, itemId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        user.wishList = user.wishList.filter(id => id.toString() !== itemId);
        await user.save();
        
        res.json({ message: "Item removed from wishlist", wishList: user.wishList });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get user's wishlist IDs only
router.get("/:userId/wishlist/ids", async (req, res) => {
  try {
      const { userId } = req.params;

      // Find the user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ wishListIds: user.wishList });
  } catch (error) {
      console.error("Error fetching wishlist IDs:", error);
      res.status(500).json({ message: "Server Error" });
  }
});


// Get user's wishlist with actual item details
router.get("/:userId/wishlist", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch item details for each ID in wishList
        const items = await Item.find({ _id: { $in: user.wishList } });

        res.json({ wishList: items });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


// Get user's buyList items
router.get("/:userId/buyList", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const buyListItems = await Item.find({ _id: { $in: user.buyList } });
        res.json({ buyList: buyListItems });

    } catch (error) {
        console.error("Error fetching buyList:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get user's sellList items
router.get("/:userId/sellList", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const sellListItems = await Item.find({ _id: { $in: user.sellList } });
        res.json({ sellList: sellListItems });

    } catch (error) {
        console.error("Error fetching sellList:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get user's sellList IDs only
router.get("/:userId/sellList/ids", async (req, res) => {
  try {
      const { userId } = req.params;

      // Find the user
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ sellListIds: user.sellList });
  } catch (error) {
      console.error("Error fetching sellList IDs:", error);
      res.status(500).json({ message: "Server Error" });
  }
});


// Route to delete a user and their related data
router.delete('/user/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(200).json({ message: "User deleted successfully" });

      // Find and delete all items related to the user
      const items = await Item.find({ userId: user._id });
      for (const item of items) {
          await Review.deleteMany({ _id: { $in: item.reviewIds } });
          const updateCatalog = {};
          if (item.category === "plant") updateCatalog["plantIds"] = item._id;
          else if (item.category === "seed") updateCatalog["seedIds"] = item._id;
          else updateCatalog["otherAccessories"] = item._id;
          await Catalog.updateMany({}, { $pull: updateCatalog });
          await User.updateMany({}, { $pull: { wishList: item._id.toString(), sellList: item._id.toString() } });
          await Item.findByIdAndDelete(item._id);
      }

      // Delete the user
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "User and related data deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;