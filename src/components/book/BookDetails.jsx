import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/books/${id}`)
      .then((res) => setBook(res.data));
  }, [id]);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async () => {
    if (!book) return;

    try {
      // 🔹 Create Razorpay order from backend
      const { data } = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { amount: book.price }
      );

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      const { key, order } = data;

      // 🔹 Load Razorpay script dynamically
      const res = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Failed to load Razorpay SDK. Check your connection.");
        return;
      }

      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "OldBookMart",
        description: `Buying: ${book.title}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payments/verify-payment",
            response
          );

          if (verifyRes.data.success) {
            alert("🎉 Payment Successful!");
          } else {
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "Anchal User",
          email: "anchal@example.com",
        },
        theme: {
          color: "#FBBF24",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment initiation failed");
    }
  };

  if (!book) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <img
        src={book.imageUrl || "https://via.placeholder.com/300"}
        alt={book.title}
        className="w-full h-72 object-cover rounded-md"
      />
      <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
      <p className="text-gray-700">by {book.author}</p>
      <p className="mt-2 text-yellow-700 font-semibold text-lg">
        ₹{book.price}
      </p>
      <p className="mt-3 text-gray-600">{book.description}</p>

      <button
        onClick={handleBuyNow}
        className="bg-green-500 mt-6 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Buy Now
      </button>
    </div>
  );
}
