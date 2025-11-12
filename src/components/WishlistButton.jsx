import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleWishlist, getWishlist } from "../api/wishlistApi";

const WishlistButton = ({ bookId }) => {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlist = await getWishlist();
      setInWishlist(wishlist.some((book) => book._id === bookId));
    };
    fetchWishlist();
  }, [bookId]);

  const handleToggle = async () => {
    const result = await toggleWishlist(bookId);
    setInWishlist(result.inWishlist);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:scale-110 transition-transform"
      title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart
        size={24}
        className={`${
          inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
        } transition-colors`}
      />
    </button>
  );
};

export default WishlistButton;
