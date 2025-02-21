const express = require('express');
const router = express.Router();
const Admin = require("../../models/admin")
const Order = require("../../models/order")
const Item = require("../../models/item")
const User = require("../../models/user")

router.post("/test",async (req,res) =>{
    const id = req.body.admin_id;
    const pass = req.body.admin_password;
    console.log(id);
    try{
        const temp = await Admin.find();
        const ans = await Admin.find({admin_id:id,admin_password:pass});
        console.log(temp);
        if(ans.length > 0){
            res.json({correct : true})
        }
        else{
            res.json({correct : false})
        }
    }
    catch(err){
        res.json({error : err})
    }
});

// Admin fetch reported orders with item, buyer, and seller details
router.get("/reported-orders", async (req, res) => {
    try {
        // Find orders where report is true
        const reportedOrders = await Order.find({ report: true });

        // If no reported orders found
        if (reportedOrders.length === 0) {
            return res.json({ message: "No reported orders found" });
        }

        // Fetch details for each order
        const orderDetails = await Promise.all(reportedOrders.map(async (order) => {
            const item = await Item.findById(order.itemId);
            const buyer = await User.findById(order.userId);
            const seller = item ? await User.findById(item.userId) : null;

            return {
                orderId: order._id,
                problem: order.problem,
                item: item ? { name: item.name, price: item.price, description: item.description } : null,
                buyer: buyer ? { name: buyer.name, email: buyer.email } : null,
                seller: seller ? { name: seller.name, email: seller.email } : null
            };
        }));

        res.json({ reportedOrders: orderDetails });
    } catch (error) {
        console.error("Error fetching reported orders:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Approve an item
router.put("/approve-item/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;

        // Find the item and update its status
        const item = await Item.findByIdAndUpdate(itemId, { status:"approve" });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item approved successfully", item });
    } catch (error) {
        console.error("Error approving item:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Block an item
router.put("/block-item/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;

        // Find the item and update its status
        const item = await Item.findByIdAndUpdate(itemId, { status:"block" });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item blocked successfully", item });
    } catch (error) {
        console.error("Error blocking item:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;