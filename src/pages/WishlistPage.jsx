import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import axios from "axios";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      console.log(data);
      
      setWishlist(data || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist 😔");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      await removeFromWishlist(bookId);
      setWishlist((prev) => prev.filter((item) => item.book?._id !== bookId));
      toast.success("Removed from wishlist 💔");
    } catch (err) {
      console.error(err);
      toast.error("Error removing from wishlist");
    }
  };

  // ✅ Razorpay Payment Integration
  const handlePayment = async (book) => {
    try {
      console.log(book);
      
      const token = localStorage.getItem("token");
      console.log(token);
      
      if (!token) {
        toast.error("Please login first!");
        return;
      }

      // Step 1️⃣: Create order
  
      
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: book.price, bookId: book._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { order, key } = data;

      // Step 2️⃣: Open Razorpay window
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "BookShare",
        description: `Payment for ${book.title}`,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                ...response,
                bookId: book._id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful 🎉");
            } else {
              toast.error("Payment verification failed ❌");
            }
          } catch (error) {
            console.error("Verification Error:", error);
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
      console.error("Payment Error:", error);
      toast.error("Failed to start payment 💸");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6 sm:p-10">
      <Toaster position="top-center" />
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 bg-white shadow p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-3xl font-extrabold text-rose-600">My Wishlist 💖</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse text-lg">
          Loading your wishlist...
        </p>
      ) : wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No books in wishlist 💔
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => {
            const book = item || {};
            return (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <img
                  src={book.imageUrl || "https://via.placeholder.com/300"}
                  alt={book.title || "Book"}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {book.title || "Untitled"}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">
                    by {book.author || "Unknown"}
                  </p>
                  <p className="text-green-600 font-bold mt-2">
                    ₹{book.price || "N/A"}
                  </p>

                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleRemove(book._id)}
                      className="flex items-center gap-1 text-rose-500 hover:text-rose-700 transition"
                    >
                      <Heart size={18} fill="currentColor" /> Remove
                    </button>

                    <button
                      onClick={() => handlePayment(book)}
                      className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg shadow hover:bg-rose-600 transition"
                    >
                      <ShoppingCart size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
