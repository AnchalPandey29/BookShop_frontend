import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { Loader2 } from "lucide-react";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  // ✅ Fetch Firebase token safely
  const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
    return await user.getIdToken(true);
  };

  // ✅ Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  // ✅ Check if book is already in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = await getToken();
        const res = await axios.get("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlist = res.data.wishlist || [];
        const exists = wishlist.some((item) => item.book?._id === id);
        setWishlisted(exists);
      } catch (err) {
        console.warn("Could not fetch wishlist");
      }
    };
    checkWishlist();
  }, [id]);

  // ✅ Toggle Wishlist
  const toggleWishlist = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        "http://localhost:5000/api/wishlist/toggle",
        { bookId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "added") {
        setWishlisted(true);
        toast.success("💖 Added to Wishlist");
      } else {
        setWishlisted(false);
        toast("💔 Removed from Wishlist");
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      toast.error("Failed to update wishlist");
    }
  };

  // ✅ Handle Buy (Razorpay)
  const handleBuy = async () => {
    try {
      const token = await getToken();
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: book.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order, key } = res.data;
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "BookShare Store",
        description: `Purchase of ${book.title}`,
        order_id: order.id,
        handler: async (response) => {
          const verify = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (verify.data.success) {
            toast.success("✅ Payment Successful!");
          } else {
            toast.error("❌ Payment Verification Failed!");
          }
        },
        theme: { color: "#2563eb" },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed to initiate");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading book details...
      </div>
    );

  if (!book)
    return (
      <p className="text-center text-gray-600 mt-20 text-lg">
        Book not found 🥺
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-8 flex flex-col items-center">
      <Toaster position="top-center" />

      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow"
      >
        ← Back
      </button>

      <div className="max-w-4xl bg-white/90 shadow-2xl rounded-2xl overflow-hidden grid md:grid-cols-2 border border-gray-100">
        <img
          src={book.imageUrl || "/placeholder-book.jpg"}
          alt={book.title}
          className="w-full h-96 object-cover"
        />

        <div className="p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {book.title}
            </h1>
            <p className="text-gray-500 italic mb-4">by {book.author}</p>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">
              {book.description || "No description available."}
            </p>
            <p className="text-2xl font-semibold text-blue-600 mb-4">
              ₹{book.price}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleBuy}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
             Buy Now
            </button>

            <button
              onClick={toggleWishlist}
              className={`px-6 py-2 rounded-lg shadow transition ${
                wishlisted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-yellow-400 text-black hover:bg-yellow-500"
              }`}
            >
              {wishlisted ? "❤️ In Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
