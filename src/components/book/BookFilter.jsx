import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";

export default function BookFilter() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    near: "",
  });
  const [sort, setSort] = useState("newest");
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // 📍 Capture user location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("📍 Location captured successfully!");
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Please enable location access for nearby search.");
      }
    );
  };

  // 🧠 Handle input changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // 🚀 Fetch filtered + sorted + paginated books
  const fetchFilteredBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (coords.lat && coords.lng) {
        params.append("lat", coords.lat);
        params.append("lng", coords.lng);
      }

      params.append("page", page);
      params.append("limit", 9);

      const res = await axios.get(
        `http://localhost:5000/api/books?${params.toString()}`
      );

      let sortedBooks = [...res.data];
      if (sort === "priceLow")
        sortedBooks.sort((a, b) => a.price - b.price);
      if (sort === "priceHigh")
        sortedBooks.sort((a, b) => b.price - a.price);
      if (sort === "newest")
        sortedBooks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      if (sort === "oldest")
        sortedBooks.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

      setBooks(sortedBooks);
      setTotalPages(sortedBooks.length < 9 ? page : page + 1);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredBooks();
    // eslint-disable-next-line
  }, [page, sort]);

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📚 Old Book Marketplace
      </h1>

      {/* 🔍 Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-wrap gap-4 items-end justify-center">
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
          className="border p-2 rounded w-40"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="near"
          placeholder="Distance (km)"
          value={filters.near}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />

        <button
          onClick={getLocation}
          className="bg-yellow-400 px-4 py-2 rounded text-black hover:bg-yellow-500"
        >
          Get Location 📍
        </button>

        <button
          onClick={() => {
            setPage(1);
            fetchFilteredBooks();
          }}
          disabled={loading}
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-44"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </div>

      {/* 📚 Books Section */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg animate-pulse">
          Loading books...
        </p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No books found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="cursor-pointer transform hover:scale-[1.02] transition"
              onClick={() => navigate(`/books/${book._id}`)}
            >
              <BookCard
                book={book}
                userId={userId}
                token={token}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
