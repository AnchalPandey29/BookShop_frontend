
import AddBook from "../components/AddBook";
import BookList from "../components/BookList";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.displayName || "User"} 👋
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      <AddBook onBookAdded={() => window.location.reload()} />
      <BookList />
    </div>
  );
}
