# Plant AI Intelligeous

## 🌱 Overview
**Plant AI Intelligeous** is an advanced AI-powered platform designed to enhance plant care by integrating intelligent identification, disease detection, and efficient e-commerce functionality. The system allows users to buy and sell plants, seeds, and accessories while leveraging AI to identify plants,and diagnose diseases. The platform features an intuitive interface for users and an administrative panel to ensure smooth operation and content approval.

## 🚀 Features

### 🛠 Admin Panel
- Approve or block items (plants, seeds, accessories) submitted by users.
- User-submitted items go through an approval process before being displayed on the home page.
- Handle order issues reported by users and manually resolve them.
- Write reports on problematic orders and take necessary actions.

### 🌿 User Features
- **Home Page:** Users can browse items categorized as plants, seeds, and accessories.
- **Sorting & Filtering:** Sort items by price (ascending/descending) and rating (ascending/descending).
- **Search:** Efficient search functionality for quick item discovery.
- **Wishlist:** Save favorite items for future reference.
- **Add & Modify Items:** Users can submit new items, which go to the admin for approval. They can also modify their submitted items.
- **Purchase Items:** Buy items based on stock availability.
- **Order Management:** View purchased items, provide reviews, and report issues with orders.
- **AI ChatBot:** Users can ask questions about plants.
- **Plant Identification:** Upload an image, and the system identifies the plant and provides relevant information.
- **Plant Disease Detection:** Upload an image, and the system detects any disease present in the plant.

### 🤖 Machine Learning Features
- **Plant Identification** - Identifies plants from uploaded images.
- **ChatBot** - AI-powered chatbot for plant-related queries.
- **Review System** - Users can leave reviews on purchased items.
- **Plant Disease Detection** - Detects plant diseases based on image analysis.

## 🏗 Tech Stack
- **Frontend:** Next.js
- **Backend:** Flask (ML-based features), Node.js (other functionalities)
- **Database:** MongoDB Atlas

## 📦 Installation
### Prerequisites:
- Node.js
- Python (for ML models)
- MongoDB Atlas configured

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/jkchavda8/Plant_Intelligence.git
   ```
2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
4. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```
5. Start the frontend server:
   ```bash
   npm run dev
   ```
6. Run AI-based APIs:
   - **ChatBot API:**
     ```bash
     cd ../AI_Api/chatBot
     python app.py
     ```
   - **Plant Identification API:**
     ```bash
     cd ../identifyPlantApi
     python app.py
     ```
   - **Plant Disease Detection API:**
     ```bash
     cd ../plantDisease
     python app.py
     ```
   - **Review API:**
     ```bash
     cd ../reviewApi
     python app.py
     ```

## 📝 Usage
1. Login to access user functionalities.
2. Browse items and use sorting/searching features.
3. Upload an image to identify plants or detect diseases.
4. Ask plant-related queries using the AI ChatBot.
5. Add items to the wishlist, buy items, and leave reviews.
6. Report any issues with purchased items.

## 🤝 Contributing
Contributions are welcome! Feel free to submit issues or pull requests.

## 📞 Contact
For queries, reach out to: 
- Email: jay886888@gmail.com
- GitHub: (https://github.com/jkchavda8)

---
🌱 **Grow Smarter with Plant AI Intelligeous!** 🌱
