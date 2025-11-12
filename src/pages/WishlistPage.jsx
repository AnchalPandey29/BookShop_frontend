import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data || []);
    } catch {
      toast.error("Failed to load wishlist 😔");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeFromWishlist(bookId);
      setWishlist((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Removed from wishlist 💔");
    } catch {
      toast.error("Error removing from wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

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
        <h1 className="text-3xl font-extrabold text-rose-600">
          My Wishlist 💖
        </h1>
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
          {wishlist.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={book.imageUrl || "https://via.placeholder.com/300"}
                alt={book.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {book.title}
                </h2>
                <p className="text-gray-500 text-sm mb-2">by {book.author}</p>
                <p className="text-green-600 font-bold mt-2">₹{book.price}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleRemove(book._id)}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-700 transition"
                  >
                    <Heart size={18} fill="currentColor" /> Remove
                  </button>

                  <button
                    onClick={() => navigate(`/buy/${book._id}`)}
                    className="flex items-center gap-1 bg-rose-500 text-white px-3 py-1.5 rounded-lg shadow hover:bg-rose-600 transition"
                  >
                    <ShoppingCart size={16} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
