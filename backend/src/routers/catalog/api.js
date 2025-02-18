const express = require("express");
const router = express.Router();
const Catalog = require("../../models/catalog");

// API to get all plant items
router.get("/plantItems", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found" });
        }
        const plantItems = await Item.find({ _id: { $in: catalog.plantIds } });
        res.json(plantItems);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to get all seed items
router.get("/seedItems", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found" });
        }
        const seedItems = await Item.find({ _id: { $in: catalog.seedIds } });
        res.json(seedItems);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API to get all other accessories items
router.get("/otherAccessoriesItems", async (req, res) => {
    try {
        const catalog = await Catalog.findOne();
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found" });
        }
        const otherAccessoriesItems = await Item.find({ _id: { $in: catalog.otherAccessories } });
        res.json(otherAccessoriesItems);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/plantIds/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Catalog.findOneAndUpdate({}, { $pull: { plantIds: id } });
        res.json({ message: "PlantId deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/seedIds/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Catalog.findOneAndUpdate({}, { $pull: { seedIds: id } });
        res.json({ message: "SeedId deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/otherAccessories/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Catalog.findOneAndUpdate({}, { $pull: { otherAccessories: id } });
        res.json({ message: "OtherAccessory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
