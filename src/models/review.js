const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }, 
    star: { type: Number, min: 1, max: 5 },  
    comment: String  
});

module.exports = mongoose.model("Review", reviewSchema);
