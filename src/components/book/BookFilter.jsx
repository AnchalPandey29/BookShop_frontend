import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  PlusCircle,
  LocateFixed,
  XCircle,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function BookFilter() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 2000],
    near: "",
  });
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Load categories
  useEffect(() => {
    setCategories([
      "Engineering",
      "Medical",
      "Novels",
      "Biography",
      "Science",
      "Commerce",
      "Technology",
      "Comics",
      "Other",
    ]);
  }, []);

  // Fetch filtered books
  const fetchFilteredBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      params.append("minPrice", filters.priceRange[0]);
      params.append("maxPrice", filters.priceRange[1]);
      if (filters.near) params.append("near", filters.near);
      if (coords.lat && coords.lng) {
        params.append("lat", coords.lat);
        params.append("lng", coords.lng);
      }

      const res = await axios.get(`http://localhost:5000/api/books?${params}`);
      setBooks(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredBooks();
  }, []);

  // Get location
  const getLocation = () => {
    if (!navigator.geolocation)
      return toast.error("Geolocation not supported!");

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        toast.success("📍 Location captured!");
      },
      () => {
        setLoading(false);
        toast.error("⚠️ Please allow location access.");
      }
    );
  };

  const handleCategorySelect = (cat) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    setShowCategoryList(false);
  };

  const resetFilters = () => {
    setFilters({ category: "", priceRange: [0, 2000], near: "" });
    setCoords({ lat: null, lng: null });
    fetchFilteredBooks();
  };

  const toggleWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login to use wishlist ❤️");

      const res = await axios.post(
        "http://localhost:5000/api/wishlist/toggle",
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { status } = res.data;

      if (status === "added") {
        toast.success("Added to Wishlist 💖");
        navigate("/wishlist");
      } else {
        toast("Removed from Wishlist 💔");
        setWishlist(wishlist.filter((id) => id !== bookId));
      }
    } catch {
      toast.error("Error updating wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <Toaster position="top-center" />

      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Explore Books on <span className="text-yellow-500">BookShare</span>
      </h1>

      {/* -------------------- Filter Section -------------------- */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 border border-gray-200 flex flex-wrap gap-6 justify-center items-end">

        {/* Category */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Category..."
            value={filters.category}
            onFocus={() => setShowCategoryList(true)}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="border p-3 rounded-xl w-48 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          {showCategoryList && (
            <ul className="absolute bg-white shadow-lg border rounded-xl w-48 mt-1 max-h-40 overflow-y-auto z-10">
              {categories
                .filter((cat) =>
                  cat.toLowerCase().includes(filters.category.toLowerCase())
                )
                .map((cat) => (
                  <li
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="px-3 py-2 hover:bg-yellow-100 cursor-pointer"
                  >
                    {cat}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="w-72">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </label>

          <div className="relative h-8 flex items-center">
            <div className="absolute h-2 bg-gray-200 w-full rounded-full"></div>
            <div
              className="absolute h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${
                  (filters.priceRange[0] / 2000) * 100
                }%`,
                right: `${
                  100 - (filters.priceRange[1] / 2000) * 100
                }%`,
              }}
            ></div>

            {["min", "max"].map((type, idx) => (
              <input
                key={type}
                type="range"
                min="0"
                max="2000"
                value={filters.priceRange[idx]}
                step="50"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setFilters((prev) => {
                    const newRange = [...prev.priceRange];
                    newRange[idx] =
                      idx === 0
                        ? Math.min(value, newRange[1] - 50)
                        : Math.max(value, newRange[0] + 50);

                    return { ...prev, priceRange: newRange };
                  });
                }}
                className="absolute w-full bg-transparent appearance-none"
              />
            ))}
          </div>
        </div>

        {/* Distance */}
        <input
          type="number"
          placeholder="Distance (km)"
          value={filters.near}
          onChange={(e) => setFilters({ ...filters, near: e.target.value })}
          className="border p-3 rounded-xl w-40 focus:ring-2 focus:ring-yellow-400 outline-none"
        />

        {/* Get Location */}
        <button
          onClick={getLocation}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl shadow transition"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <LocateFixed className="animate-pulse" size={18} />
          )}
          Get Location
        </button>

        {/* Apply & Reset */}
        <div className="flex gap-2">
          <button
            onClick={fetchFilteredBooks}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl shadow transition"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl shadow transition"
          >
            <XCircle size={16} /> Reset
          </button>
        </div>
      </div>

      {/* -------------------- Books -------------------- */}
      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No books found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div
              key={book._id}
              className="relative bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <button
                onClick={() => toggleWishlist(book._id)}
                className="absolute top-3 right-3 text-red-500 hover:scale-110 transition"
              >
                <Heart
                  size={24}
                  className={`${
                    wishlist.includes(book._id) ? "fill-red-500" : "fill-none"
                  }`}
                />
              </button>

              <img
                src={book.imageUrl || "https://via.placeholder.com/300"}
                alt={book.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {book.title}
                </h2>
                <p className="text-gray-500 text-sm">by {book.author}</p>

                <p className="text-yellow-600 font-bold mt-3">
                  ₹{book.price}
                </p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/books/${book._id}`)}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition"
                  >
                    View
                  </button>

                  {book.sellerId === userId && (
                    <button
                      onClick={() => navigate(`/books/edit/${book._id}`)}
                      className="bg-yellow-400 text-black px-4 py-2 rounded-xl hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/sell")}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-black p-4 rounded-full shadow-xl transition hover:scale-110"
      >
        <PlusCircle size={32} />
      </button>
    </div>
  );
}
