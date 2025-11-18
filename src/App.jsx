import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from "./components/book/BookList";
import PaymentSuccess from './components/book/PayementSuccess';
import CheckoutPage from './components/book/CheckoutPage';
import AddBook from './components/book/AddBook';
import BookDetails from './components/book/BookDetails';
import BookFilter from './components/book/BookFilter';
import WishlistPage from './pages/WishlistPage';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import Contact from './pages/Contact';


function App() {

  return (
    <>
  <BrowserRouter>
  <Navbar/>

  <Routes>
    <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>

    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>
   <Route path="/find" element={<BookList />} />
   <Route path="/books" element={<BookFilter />} />
  <Route path="/sell" element={<AddBook />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path="/payment-success" element={<PaymentSuccess />} />
     <Route path="/my-books" element={<BookList myBooksOnly />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<MyOrders />} />
  </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
