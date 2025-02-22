'use client';
import { motion } from "framer-motion";

export default function fun(){
    return (
        <motion.div 
            className="col-span-3 flex flex-col items-center justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
            className="p-6 bg-gray-100 rounded-2xl shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            >
            <p className="text-gray-700 font-semibold text-lg">Oops! No items found.</p>
            </motion.div>
            
        </motion.div>
    );
}