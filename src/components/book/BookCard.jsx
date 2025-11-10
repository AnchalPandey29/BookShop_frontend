import React from "react";
import { deleteBook, createPaymentOrder, verifyPayment } from "../../api/payment";

const BookCard = ({ book, userId, token, onDelete }) => {
  const handleDelete = async () => {
    await deleteBook(book._id, token);
    onDelete(book._id);
  };

  const handleBuy = async () => {
    try {
      const orderData = await createPaymentOrder(book.price);
      if (!orderData.success) return alert("Payment setup failed!");

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "OldBooks Marketplace",
        description: book.title,
        order_id: orderData.order.id,
        handler: async function (response) {
          const verify = await verifyPayment(response);
          if (verify.success) alert("✅ Payment successful!");
          else alert("❌ Payment verification failed");
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Error during payment!");
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <img
        src={book.image || "https://via.placeholder.com/150"}
        alt={book.title}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
      <p className="text-gray-600">{book.author}</p>
      <p className="text-green-700 font-bold">₹{book.price}</p>

      <div className="mt-3 flex gap-2">
        {book.sellerId === userId ? (
          <>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
            {/* You can navigate to edit form */}
          </>
        ) : (
          <button
            onClick={handleBuy}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
