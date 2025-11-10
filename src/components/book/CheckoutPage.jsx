import React from "react";
import { useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const { state } = useLocation();
  const book = state?.book;

  const loadRazorpay = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return alert("Razorpay SDK failed to load");

    const order = await fetch("http://localhost:5000/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: book.price }),
    }).then((r) => r.json());

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "BookShare",
      description: `Purchase ${book.title}`,
      order_id: order.id,
      handler: (res) => alert("✅ Payment Success!"),
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!book) return <p>No book selected.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow-md w-80 text-center">
        <img src={book.image} alt={book.title} className="h-40 mx-auto rounded" />
        <h2 className="mt-2 font-semibold">{book.title}</h2>
        <p className="text-green-600 font-bold mt-1">₹{book.price}</p>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Pay with Razorpay
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
