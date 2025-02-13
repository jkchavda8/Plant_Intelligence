// const express = require("express");
// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const mongoose = require("mongoose");
// const User = require("../../models/user");
// const router = express.Router();
// const { GridFSBucket } = require("mongodb");

// // ✅ MongoDB Connection with Proper Options
// const mongoURI = "mongodb+srv://mahendrafenil8:Svsm4142@cluster0.eembine.mongodb.net/PlantDB";
// const conn = mongoose.createConnection(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// let gfs, gridFSBucket;
// conn.once("open", () => {
//     gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
//     gfs = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
//     console.log("✅ GridFS Initialized");
// });

// // ✅ Configure GridFsStorage (Fixed)
// const storage = new GridFsStorage({
//     url: mongoURI,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             if (!file) {
//                 return reject(new Error("No file uploaded"));
//             }
//             resolve({
//                 filename: `${Date.now()}-${file.originalname}`,
//                 bucketName: "uploads",
//             });
//         });
//     },
// });

// const upload = multer({ storage });

// // ✅ User Registration with Profile Image Upload
// router.post("/register", upload.single("profileImage"), async (req, res) => {
//     try {
//         console.log("File received:", req.file); // Debugging line
        
//         const { name, email, password, address, phone } = req.body;
//         if (!name || !email || !password || !address || !phone) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         if (!req.file) {
//             return res.status(400).json({ error: "Profile image is required" });
//         }

//         const profileImage = req.file.filename;

//         const newUser = new User({
//             name,
//             email,
//             password,
//             address,
//             phone,
//             profileImage,
//             wishList: [],
//             buyList: [],
//             sellList: [],
//         });

//         await newUser.save();
//         res.status(201).json({ message: "✅ User registered successfully", newUser });
//     } catch (err) {
//         console.error("Error:", err.message); // Debugging
//         res.status(500).json({ error: err.message });
//     }
// });

// // ✅ Fetch Image API (Fixed `gfs` issue)
// router.get("/image/:filename", async (req, res) => {
//     try {
//         if (!gfs) {
//             return res.status(500).json({ error: "GridFS not initialized yet" });
//         }

//         const files = await gfs.find({ filename: req.params.filename }).toArray();
//         if (!files || files.length === 0) {
//             return res.status(404).json({ error: "File not found" });
//         }

//         // Stream the image back
//         const readStream = gridFSBucket.openDownloadStreamByName(req.params.filename);
//         readStream.pipe(res);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
