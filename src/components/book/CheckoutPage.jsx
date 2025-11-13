import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RazorpayCheckout({ book }) {
  const handlePayment = async () => {
    try {
      console.log(book);
      const token = localStorage.getItem("token");
      const amount = book.price;
      

      // Step 1️⃣: Create Order from Backend
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount, bookId: book._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order, key } = data;

      // Step 2️⃣: Initialize Razorpay
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "BookShare",
        description: "Book Purchase Payment",
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify-payment",
            {
              ...response,
              bookId: book._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful 🎉");
          } else {
            toast.error("Payment verification failed ❌");
          }
        },
        prefill: {
          name: "Book Buyer",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F43F5E",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="flex items-center gap-1 text-white bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded-lg"
    >
      Buy Now
    </button>
  );
}
