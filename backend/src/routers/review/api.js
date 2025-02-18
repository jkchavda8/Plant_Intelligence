const express = require('express');
const router = express.Router();
const Item = require("../../models/item");
const Review = require("../../models/review");
const fetch = require("node-fetch");


router.post("/addReview",async (req,res)=>{
    const { itemId, userId, rating, comment } = req.body;
    // console.log("here")
    try {
        // Call Python API for sentiment analysis
        const sentimentResponse = await fetch("http://127.0.0.1:5001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ review: comment })
      });

      const sentimentData = await sentimentResponse.json();

      const sentiment = sentimentData.sentiment;
      const sentimentScore = sentimentData.score;

      // Save review with sentiment
      const newReview = new Review({
          itemId, 
          userId, 
          rating, 
          comment,
          sentiment, 
          sentiment_score: sentimentScore, 
      });
      await newReview.save();

      // Recalculate place ranking
      const reviews = await Review.find({itemId: itemId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      // Calculate the average sentiment score (use the compound value of the sentiment score)
      const avgSentimentScore = reviews.reduce((sum, r) => sum + r.sentiment_score.compound, 0) / reviews.length;

      // New weighted score (combining rating & sentiment)
      const weightedScore = (avgRating * 0.7) + (avgSentimentScore * 0.3);

      const item = await Item.findById(itemId);
      if (item) {
          item.reviewIds = item.reviewIds || [];
          
          if (!item.reviewIds.includes(newReview._id)) {
              item.reviewIds.push(newReview._id);
              await item.save(); 
          }
      }      

      await Item.findByIdAndUpdate(itemId, {
          average_rating: avgRating.toFixed(1),
          sentiment_score: avgSentimentScore.toFixed(2), 
          weighted_score: weightedScore.toFixed(2)
      });

      res.json({ message: "Review added with sentiment analysis" });
      
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/FindReviews/:itemId", async (req, res) => {
    try {
        // console.log('here')
      const reviews = await Review.find({ itemId: req.params.itemId })
        .populate('userId', 'name email');
  
      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


  // Route to delete a review by ID
router.delete('/review/:id', async (req, res) => {
  try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Server error", error });
  }
});
  
module.exports = router;
