const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" }, 
    rating: { type: Number, min: 1, max: 5 },  
    comment: String  ,
    sentiment: { 
        type: String, 
        enum: ["positive", "negative", "neutral"] 
    },
    sentiment_score: { 
        type: Object,
        default: { compound: 0, pos: 0, neu: 0, neg: 0 }
    },
});

module.exports = mongoose.model("Review", reviewSchema);
