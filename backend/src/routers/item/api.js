const express = require("express");
const router = express.Router();
const Item = require("../../models/item");
const User = require("../../models/user");
const Review = require("../../models/review");

// Create a new item
router.post("/item", async (req, res) => {
    try {
        const { name, description, price, category, userId, images, stock, keyPoints } = req.body;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure keyPoints is an object
        if (keyPoints && typeof keyPoints !== "object") {
            return res.status(400).json({ message: "Invalid keyPoints format" });
        }
        
        const newItem = new Item({ name, description, price, category, userId, images, stock, keyPoints });
        await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find().populate("userId", "name email");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all items which has approve
router.get("/all", async (req, res) => {
    try {
        const items = await Item.find({status:'approve'}).populate("userId", "name email");
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


// Get item by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate("userId", "name email").populate("reviewIds");
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Update item
router.put("/item/:id", async (req, res) => {
    try {
        // console.log('here')
        const { name, description, price, category, images, stock, keyPoints } = req.body;
        // Ensure keyPoints is an object if provided
        if (keyPoints && typeof keyPoints !== "object") {
            return res.status(400).json({ message: "Invalid keyPoints format" });
        }
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, description, price, category, images, stock, keyPoints });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete item
router.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Update stock
router.patch("/:id/stock", async (req, res) => {
    try {
        const { stock } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, { stock });
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
