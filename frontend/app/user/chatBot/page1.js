'use client';

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown"; // Import Markdown Renderer
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";

export default function ChatBotPopup({ onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(""); // Clear previous answer
    try {
      const response = await axios.post("http://localhost:5000/generate", {
        prompt: question,
      });

      setAnswer(response.data.response); // Store response
    } catch (error) {
      setAnswer("⚠️ Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-semibold flex items-center text-gray-800">
            <FaRobot className="mr-2 text-blue-500 text-2xl" /> Plant AI ChatBot
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 transition-all"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Input Field */}
        <input
          type="text"
          className="border-2 border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Ask something about plants..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleAskQuestion}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full flex items-center justify-center font-medium transition-all"
          disabled={loading}
        >
          {loading ? "Thinking..." : <><FaPaperPlane className="mr-2" /> Ask</>}
        </button>

        {/* Answer Section */}
        <div className="mt-4 border-2 border-gray-200 p-4 rounded-lg bg-gray-50 text-gray-800">
          <strong className="text-blue-600">Answer:</strong>
          <div className="mt-2 min-h-[50px] text-gray-700 leading-relaxed">
            {loading ? (
              "⏳ Generating response..."
            ) : (
              <ReactMarkdown>{answer || "Your answer will appear here..."}</ReactMarkdown>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
