'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Input, Card, Skeleton, message } from "antd";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportModal, setReportModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [reportText, setReportText] = useState("");

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:8000/order/all");
                setOrders(response.data.filter(order => order.userId._id === userId));
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    const handleDelete = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8000/order/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId));
            message.success("Order deleted successfully!");
        } catch (error) {
            console.error("Error deleting order", error);
            message.error("Failed to delete order.");
        }
    };

    const handleReport = async () => {
        if (!selectedOrder) return;
        try {
            await axios.patch(`http://localhost:8000/order/report/${selectedOrder._id}`, { problem: reportText });
            setOrders(orders.map(order =>
                order._id === selectedOrder._id ? { ...order, report: true, problem: reportText } : order
            ));
            setReportModal(false);
            setReportText("");
            message.success("Order reported successfully!");
        } catch (error) {
            console.error("Error reporting order", error);
            message.error("Failed to report order.");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Orders</h2>
            {loading ? (
                <Skeleton active />
            ) : (
                <div>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <Card key={order._id} className="mb-6 shadow-md rounded-xl border">
                                <div className="flex items-center gap-6">
                                    <img 
                                        src={order.itemId.images[0]} 
                                        alt={order.itemId.name} 
                                        className="w-28 h-28 object-cover rounded-lg border shadow-sm"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{order.itemId.name}</h3>
                                        <p className="text-gray-600 text-sm">{order.itemId.description}</p>
                                        <p className="text-gray-700"><strong>Quantity:</strong> {order.quantity}</p>
                                        <p className="text-gray-700"><strong>Total:</strong> <span className="text-green-600 font-semibold">${order.totalAmount}</span></p>
                                        <p className="text-gray-500 text-sm"><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <div className="flex gap-4 mt-4">
                                            <Button type="primary" danger onClick={() => handleDelete(order._id)}>
                                                Delete Order
                                            </Button>
                                            <Button type="default" onClick={() => { setSelectedOrder(order); setReportModal(true); }}>
                                                Report Issue
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-lg">No orders found</p>
                    )}
                </div>
            )}

            <Modal
                title="Report an Issue"
                open={reportModal}
                onCancel={() => setReportModal(false)}
                onOk={handleReport}
                okText="Submit Report"
                cancelText="Cancel"
            >
                <p className="text-gray-700">Please describe the issue with your order below:</p>
                <Input.TextArea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Describe your issue here..."
                />
            </Modal>
        </div>
    );
};

export default OrderPage;
