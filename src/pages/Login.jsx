import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const userData = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const token = await userData.user.getIdToken();

 
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful!");
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Login Error:", err.message);
      alert("Invalid email or password. Try again!");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Google login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Login Error:", err.message);
      alert("Google login failed. Try again!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-3">
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition ${
              loading && "opacity-60 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Login with Google"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;