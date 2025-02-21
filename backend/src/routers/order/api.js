const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const User = require("../../models/user");
const Item = require("../../models/item");
const mongoose = require("mongoose");

// Place an order
router.post("/order", async (req, res) => {
    try {
        const { userId, itemId, quantity, totalAmount } = req.body;
        console.log("Received request body:", req.body); // Debugging

        // Validate input
        if (!userId || !itemId || !quantity || !totalAmount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the item being purchased
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Find the buyer
        const buyer = await User.findById(userId);
        if (!buyer) return res.status(404).json({ message: "Buyer not found" });

        // Ensure buyList and sellList exist
        buyer.buyList = buyer.buyList || [];

        // Convert itemId to string safely
        const itemIdStr = String(itemId);

        // Create a new order
        const newOrder = new Order({ userId, itemId, quantity, totalAmount });
        await newOrder.save();

        // Update buyer's buyList
        if (!buyer.buyList.includes(itemIdStr)) {
            buyer.buyList.push(itemIdStr);
            await buyer.save();  // ✅ Now this works!
        }

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// Get all orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").populate("itemId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get order by ID
router.get("/order/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("itemId");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.patch("/order/report/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { problem } = req.body; // User provides the problem description

        if (!problem) {
            return res.status(400).json({ message: "Problem description is required" });
        }

        // Find the order by ID
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order report details
        order.problem = problem;
        order.report = true;
        await order.save();

        res.status(200).json({ message: "Order reported successfully", order });
    } catch (error) {
        console.error("Error reporting order:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


module.exports = router;
