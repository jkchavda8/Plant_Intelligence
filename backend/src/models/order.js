const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    totalAmount: { type: Number, min: 0 },
    quantity: { type: Number, min: 0 },
    report: { type: Boolean, default: false },
    problem: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
