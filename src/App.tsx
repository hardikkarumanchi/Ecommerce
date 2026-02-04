import './App.css'
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Cart from './pages/Cart.tsx';
import Home from './pages/Home.tsx';
import Orders from './pages/Orders.tsx';
import Admin from './pages/Admin.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </Router>
    </>
  );
}

export default App
