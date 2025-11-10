import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

const MyListings = () => {
  const [books, setBooks] = useState([]);

  useEffect(()=> {
    const fetch = async ()=> {
      try{
        const res = await API.get("/books?mine=true"); // we'll add handler for mine on backend
        setBooks(res.data.books || res.data);
      }catch(e){ console.error(e); }
    };
    fetch();
  },[]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
      {books.length===0 && <div>No listings yet</div>}
      <div className="space-y-3">
        {books.map(b=>(
          <div key={b._id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <Link to={`/books/${b._id}`} className="font-medium">{b.title}</Link>
              <div className="text-sm text-gray-600">{b.author}</div>
            </div>
            <div>
              <button onClick={async()=>{ if(confirm("Delete?")){ await API.delete(`/books/${b._id}`); setBooks(bs=>bs.filter(x=>x._id!==b._id)); } }} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;
