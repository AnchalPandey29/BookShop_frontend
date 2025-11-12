import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye } from "lucide-react";

const BookCard = ({ book, onWishlistToggle, isWishlisted }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 relative">
      {/* Image */}
      <div className="relative">
        <img
          src={book.image || "/placeholder.png"}
          alt={book.title}
          className="w-full h-56 object-cover rounded-xl"
        />
        {/* Wishlist toggle button */}
        <button
          onClick={() => onWishlistToggle(book._id)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isWishlisted
              ? "bg-pink-500 text-white"
              : "bg-white text-pink-600 hover:bg-pink-100"
          }`}
        >
          <Heart
            size={20}
            className={isWishlisted ? "fill-white" : "fill-transparent"}
          />
        </button>
      </div>

      {/* Book Info */}
      <div className="mt-3">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-1">{book.author}</p>
        <p className="text-indigo-600 font-semibold mt-1">₹{book.price}</p>

        <div className="flex justify-between mt-3">
          <button
            onClick={() => navigate(`/books/${book._id}`)}
            className="text-sm flex items-center gap-1 bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"
          >
            <Eye size={16} /> View
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
