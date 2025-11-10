import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------- EMAIL + PASSWORD SIGNUP ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Firebase signup
      const userData = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Step 2: Update Firebase display name
      await updateProfile(userData.user, { displayName: form.name });

      // Step 3: Get Firebase token
     const token = await user.getIdToken();
await axios.post(
  "http://localhost:5000/api/users/",
  {
    name: user.displayName,
    email: user.email,   // ✅ add this line
    photoURL: user.photoURL,
    location: { coordinates: [latitude, longitude] },
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);


      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup Error:", err.message);
      alert("Signup failed! Please check your info.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE OAUTH SIGNUP ----------------
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/users/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Google signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Signup Error:", err.message);
      alert("Google signup failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className={`w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Sign Up with Google"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;