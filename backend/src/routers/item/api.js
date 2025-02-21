const express = require("express");
const router = express.Router();
const Item = require("../../models/item");
const User = require("../../models/user");
const Review = require("../../models/review");
const Catalog = require("../../models/catalog");

// Create a new item
router.post("/storeItem", async (req, res) => {
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

// API to get item IDs based on search string
router.get("/searchItems/:query", async (req, res) => {
    try {
        const { query } = req.params;
        const items = await Item.find({ name: { $regex: query, $options: "i" } });
        res.json(items);
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



// API to get item names based on plantIds
router.get("/plantNames", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) return res.status(404).json({ message: "Catalog not found" });
        
        const items = await Item.find({ _id: { $in: catalog.plantIds } }).select("name");
        res.json(items.map(item => item.name));
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// API to get item names based on seedIds
router.get("/seedNames", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) return res.status(404).json({ message: "Catalog not found" });
        
        const items = await Item.find({ _id: { $in: catalog.seedIds } }).select("name");
        res.json(items.map(item => item.name));
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// API to get item names based on otherAccessories
router.get("/otherAccessoryNames", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) return res.status(404).json({ message: "Catalog not found" });
        
        const items = await Item.find({ _id: { $in: catalog.otherAccessories } }).select("name");
        res.json(items.map(item => item.name));
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});



// Route to delete an item and clean related data
router.delete('/item/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(200).json({ message: "Item deleted successfully" });

        // Delete all related reviews
        await Review.deleteMany({ _id: { $in: item.reviewIds } });

        // Remove item from the corresponding catalog list
        const updateCatalog = {};
        if (item.category === "plant") updateCatalog["plantIds"] = item._id;
        else if (item.category === "seed") updateCatalog["seedIds"] = item._id;
        else updateCatalog["otherAccessories"] = item._id;
        
        await Catalog.updateMany({}, { $pull: updateCatalog });

        // Remove item from all users' wishLists and sellLists
        await User.updateMany({}, { $pull: { wishList: item._id.toString(), sellList: item._id.toString() } });

        // Finally, delete the item
        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Item and related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
