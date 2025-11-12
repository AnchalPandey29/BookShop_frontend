const API_BASE = "http://localhost:5000/api";

export const fetchBooks = async () => {
  const res = await fetch(`${API_BASE}/books`);
  return res.json();
};

export const addBook = async (book, token) => {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const deleteBook = async (id, token) => {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const updateBook = async (id, updated, token) => {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updated),
  });
  return res.json();
};

export const createOrder = async (amount) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${API_BASE}/payments/create-order`,
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const verifyPayment = async (paymentInfo) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(`${API_BASE}/payments/verify-payment`, paymentInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
