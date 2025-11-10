import React, { useEffect, useState } from "react";
import { fetchBooks } from "../../api/payment";
import BookCard from "../book/BookCard";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBooks().then((data) => setBooks(data));
  }, []);

  const handleDelete = (id) => {
    setBooks(books.filter((b) => b._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Old Book Store</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            userId={userId}
            token={token}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;
