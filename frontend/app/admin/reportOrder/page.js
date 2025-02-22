'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ReportedOrdersPage() {
  const [reportedOrders, setReportedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reported-orders');
        setReportedOrders(response.data.reportedOrders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedOrders();
  }, []);

  return (
    <div className="p-6 bg-red-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin - Reported Orders</h1>
      <Link
        href="/admin"
        className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 sm:w-48 md:w-64 text-center justify-center"
      >
        <span className="text-lg">←</span> Back to Main Page
      </Link>


      
      {loading && <p className="text-gray-700">Loading reported orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && reportedOrders.length === 0 && <p className="text-gray-700">No reported orders found.</p>}
      
      {!loading && !error && reportedOrders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {reportedOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-xl shadow-md p-6 border border-red-300">
              
              <h2 className="text-xl font-semibold text-red-600">Issue: {order.problem}</h2>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">Item Details</h3>
                {order.item ? (
                  <>
                    <p className="text-gray-700"><strong>{order.item.name}</strong> - ${order.item.price}</p>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-gray-600 font-semibold">Total Amount: ${order.totalAmount}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Item not found</p>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">Buyer</h3>
                {order.buyer ? (
                  <>
                    <p className="text-gray-700"><strong>{order.buyer.name}</strong> ({order.buyer.email})</p>
                    <p className="text-gray-600">Phone: {order.buyer.phone || 'N/A'}</p>
                    <p className="text-gray-600">Address: {order.buyer.address || 'N/A'}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Buyer details not available</p>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-800">Seller</h3>
                {order.seller ? (
                  <>
                    <p className="text-gray-700"><strong>{order.seller.name}</strong> ({order.seller.email})</p>
                    <p className="text-gray-600">Phone: {order.seller.phone || 'N/A'}</p>
                    <p className="text-gray-600">Address: {order.seller.address || 'N/A'}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Seller details not available</p>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}