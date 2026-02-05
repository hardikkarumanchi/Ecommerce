import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import supabase from '../lib/supabase';
import './Admin.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Security Check: If not an admin, don't show the page
  if (user?.role !== 'admin') {
    return <div className="error-container"><h2>Access Denied. Admins Only.</h2></div>;
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('products')
      .insert([{
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl
      }]);

    if (error) {
      alert("Error adding product: " + error.message);
    } else {
      alert("Product added successfully!");
      // Clear form
      setName(''); setPrice(''); setDescription(''); setImageUrl('');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-nav">
        <Link to="/home" className="nav-btn">← Back to Store</Link>
        <Link to="/cart" className="nav-btn">Check Cart 🛒</Link>
      </div>

      <h1>Admin Dashboard</h1>
      <form onSubmit={handleAddProduct} className="admin-form">
        <h3>Add New Product</h3>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button type="submit" className="add-btn">Upload to Store</button>
      </form>
    </div>
  );
};

export default AdminDashboard;