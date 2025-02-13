const mongoose = require("mongoose");

const catalogSchema = mongoose.Schema({
    plantIds: [String],
    seedIds: [String],
    otherAccessories: [String]
});

module.exports = mongoose.model("Catalog", catalogSchema);
