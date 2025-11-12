import axios from "axios";
import { getAuth } from "firebase/auth";

const API_URL = "http://localhost:5000/api/wishlist";

const getFreshToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) return await user.getIdToken(true);
  throw new Error("User not logged in");
};

// ✅ Fetch wishlist
export const getWishlist = async () => {
  const token = await getFreshToken();
  const res = await axios.get(`${API_URL}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.books;
};

// ✅ Toggle wishlist (add/remove)
export const toggleWishlist = async (bookId) => {
  const token = await getFreshToken();
  const res = await axios.post(
    `${API_URL}/toggle`,
    { bookId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ Remove from wishlist
export const removeFromWishlist = async (bookId) => {
  const token = await getFreshToken();
  return axios.delete(`${API_URL}/remove/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
