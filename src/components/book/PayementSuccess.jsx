import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const { book } = state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl text-green-600 font-bold mb-2">
          Payment Successful 🎉
        </h2>
        <p>You’ve purchased <strong>{book?.title}</strong></p>
        <Link
          to="/book"
          className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded"
        >
          Back to Books
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
