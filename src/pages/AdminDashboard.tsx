import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchProducts } from '../features/products/productSlice';
import supabase from '../lib/supabase';
import { Link } from 'react-router-dom';
import './Admin.css';
import Navbar from '../components/Navbar';


const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const items = useAppSelector((state) => state.products.items || []);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (user?.role !== 'admin') {
    return <div className="error-container"><h2>Access Denied. Admins Only.</h2></div>;
  }

  const clearForm = () => {
    setEditingId(null);
    setName(''); setPrice(''); setDescription(''); setImageUrl(''); setStock('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
        name, 
        price: parseFloat(price), 
        description, 
        image_url: imageUrl, 
        stock: parseInt(stock) 
    };

    const { error } = editingId 
      ? await supabase.from('products').update(productData).eq('id', editingId)
      : await supabase.from('products').insert([productData]);

    if (error) {
      alert("Operation failed: " + error.message);
    } else {
      alert(editingId ? "Product updated!" : "Product added!");
      clearForm();
      dispatch(fetchProducts());
    }
  };

  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setImageUrl(product.image_url);
    setStock(product.stock.toString());
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) dispatch(fetchProducts());
  };

  return (
    <div className="admin-container">
      <Navbar />
      <div className="admin-nav">
        <Link to="/home" className="nav-btn">← Back to Store</Link>
      </div>

      <h1>Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <div className="form-actions">
            <button type="submit" className="add-btn">{editingId ? "Save Changes" : "Upload Product"}</button>
            {editingId && <button type="button" onClick={clearForm} className="cancel-btn">Cancel</button>}
        </div>
      </form>

      <div className="admin-inventory-list">
        <table>
          <thead>
            <tr><th>Name</th><th>Stock</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>${product.price}</td>
                <td>
                  <button onClick={() => handleEditClick(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;