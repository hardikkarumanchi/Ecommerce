import './App.css'
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Cart from './pages/Cart.tsx';
import Home from './pages/Home.tsx';
import Orders from './pages/Orders.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { useEffect } from 'react';
import supabase from './lib/supabase.ts';
import { useAppDispatch } from './app/hooks.ts';
import { setUser } from './features/auth/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Function to sync Auth user with Database Profile
    const syncUserSession = async (user: any) => {
      if (!user) {
        dispatch(setUser(null));
        return;
      }

      // Fetch the actual name and role from your profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      // Combine them so Redux has the full picture
      dispatch(setUser({
        ...user,
        full_name: profile?.full_name || 'Customer',
        role: profile?.role || 'user'
      }));
    };

    // 1. Initial Check on Mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUserSession(session?.user ?? null);
    });

    // 2. Continuous Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Redirect root to /home for a better UX */}
        <Route path="/" element={<Navigate to="/home" />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;