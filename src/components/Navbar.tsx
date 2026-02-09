import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import supabase from '../lib/supabase';
import './navbar.css';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          <span>Essos</span>
        </Link>

        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/orders">Orders</Link>
          
          <Link to="/cart" className="nav-cart">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link">Admin</Link>
          )}

          {isAuthenticated ? (
            <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
          ) : (
            <Link to="/login" className="nav-login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;