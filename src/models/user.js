const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    phone: Number,
    wishList: [String],  
    profileImage: String,
    buyList: [String],  
    sellList: [String]  
});

module.exports = mongoose.model("User", userSchema);
