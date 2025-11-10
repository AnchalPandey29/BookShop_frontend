import { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function AddBook({ onBookAdded }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    pages: "",
    category: "",
    condition: "New",
    imageUrl: "",
  });

  const [coords, setCoords] = useState({ lat: null, long: null });
  const [loading, setLoading] = useState(false);

  // ✅ Backend base URL from .env (important)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // 📍 Capture user's location
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude),
          long: Number(pos.coords.longitude),
        });
        alert("📍 Location captured successfully!");
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Failed to capture location. Please allow location access.");
      }
    );
  };

  // 🪄 Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit new book
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coords.lat || !coords.long) {
      alert("Please capture your location before submitting!");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Get Firebase auth token
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("Please login first!");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();

      // 📦 Prepare payload (matches backend)
      const payload = {
        title: form.title,
        author: form.author,
        description: form.description,
        price: Number(form.price),
        pages: Number(form.pages),
        category: form.category,
        condition: form.condition,
        imageUrl: form.imageUrl, // ✅ changed from image → imageUrl
        coordinates: [coords.long, coords.lat], // ✅ backend expects this array
      };

      console.log("📦 Payload being sent:", payload);

      // 🚀 Send POST request to backend
      const res = await axios.post(`${API_BASE}/books`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Book added successfully!");
      console.log("📚 Added book:", res.data);

      // Reset form
      setForm({
        title: "",
        author: "",
        description: "",
        price: "",
        pages: "",
        category: "",
        condition: "New",
        imageUrl: "",
      });

      setCoords({ lat: null, long: null });
      if (onBookAdded) onBookAdded();
    } catch (err) {
      console.error("❌ Add book error:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || "Book add failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4 max-w-lg mx-auto"
    >
      <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">
        Add Your Book 📖
      </h2>

      <input
        name="title"
        placeholder="Book Title"
        value={form.title}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="author"
        placeholder="Author Name"
        value={form.author}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Book Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price (₹)"
        value={form.price}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      />
      <input
        name="pages"
        type="number"
        placeholder="Total Pages"
        value={form.pages}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        name="category"
        placeholder="Category (e.g., Fiction, Science)"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
      <input
        name="imageUrl"
        placeholder="Image URL"
        value={form.imageUrl}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <select
        name="condition"
        value={form.condition}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option>New</option>
        <option>Good</option>
        <option>Old</option>
        <option>Vintage</option>
      </select>

      <div className="flex gap-3 justify-between">
        <button
          type="button"
          onClick={handleLocation}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
        >
          Get Location 📍
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </div>
    </form>
  );
}
