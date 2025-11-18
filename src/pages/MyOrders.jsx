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
        console.log(token);

        const { data } = await axios.get("http://localhost:5000/api/purchases/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data);


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


  const downloadInvoice = async (purchaseId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/purchases/invoice/${purchaseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // IMPORTANT: PDF
        }
      );

      console.log(response);
      

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `invoice-${purchaseId}.pdf`;
      link.click();
    } catch (err) {
      console.error("Invoice Download Error:", err);
      toast.error("Failed to download invoice");
    }
  };


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
                src={order.book?.imageUrl || "/book-placeholder.png"}
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


                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="mt-4 bg-rose-500 text-white hover:bg-rose-600 px-3 py-1 rounded-lg"
                >
                  Download
                </button>


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