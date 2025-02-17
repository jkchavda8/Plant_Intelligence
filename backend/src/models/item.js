const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
    images: [String],  
    createdAt: { type: Date, default: Date.now }, 
    stock: Number,
    status:{
        type:String,
        default:"pending"
    },
    average_rating: { 
        type: Number, 
        default: 0 
    },
    sentiment_score: { 
        type: Number, 
        default: 0 
    },
    weighted_score: { 
        type: Number, 
        default: 0 
    },
    reviewIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],  
    keyPoints: Object  
});

module.exports = mongoose.model("Item", itemSchema);