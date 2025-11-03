import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';


function App() {

  return (
    <>
  <BrowserRouter>
  <Navbar/>

  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>
    
    
  </Routes>
  </BrowserRouter>

    </>
  )
}

export default App
