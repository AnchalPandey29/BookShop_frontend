import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RazorpayCheckout from "../components/book/CheckoutPage";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/purchases/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setOrders(data.purchases);
        } else {
          toast.error("Failed to load purchases");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading your purchases...</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img
          src="/empty-cart.svg"
          alt="No orders"
          className="w-56 opacity-80 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          You haven’t bought any books yet
        </h2>
        <p className="text-gray-500 mt-2">Start exploring and buy your first book!</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold text-rose-600 mb-6 text-center">
        My Orders
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >
            <div className="flex gap-4">
              <img
                src={order.book?.image || "/book-placeholder.png"}
                alt={order.book?.title}
                className="w-24 h-32 object-cover rounded-md border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {order.book?.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  by {order.book?.author || "Unknown"}
                </p>
                <p className="text-rose-600 font-medium mb-2">
                  ₹{order.amount}
                </p>
                <p className="text-gray-500 text-sm">
                  Payment ID: {order.paymentId}
                </p>
                <p className="text-green-600 text-sm mt-1 font-medium">
                  Status: {order.status}
                </p>

                <div className="mt-3 flex gap-2">
                  <RazorpayCheckout book={order.book} />
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg">
                    Download
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-right">
              Purchased on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
