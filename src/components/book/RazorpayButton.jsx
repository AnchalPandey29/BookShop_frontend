import React from "react";
import { createOrder, verifyPayment } from "../../api/payment";
import toast from "react-hot-toast";

const RazorpayButton = ({ amount }) => {
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return toast.error("Failed to load Razorpay SDK");

    const orderData = await createOrder(amount);
    const { order, key } = orderData;

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "BookShare Marketplace",
      description: "Payment for your old book",
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await verifyPayment(response);
        if (verifyRes.success) toast.success("Payment Successful!");
        else toast.error("Payment Verification Failed");
      },
      theme: { color: "#4f46e5" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-xl shadow hover:bg-indigo-700 transition-all"
    >
      Buy Now ₹{amount}
    </button>
  );
};

export default RazorpayButton;
