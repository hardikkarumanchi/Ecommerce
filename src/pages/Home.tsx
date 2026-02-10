import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productSlice';
import './Home.css';
import { addToCart } from '../features/cart/cartSlice';
//import { Link } from 'react-router-dom';
//import supabase from '../lib/supabase';
//import { logout } from '../features/auth/authSlice';
import Navbar from '../components/Navbar';

const ProductCard = ({ product, onAdd}: { product: any, onAdd: (p: any, q: number) => void, dispatch: any }) => {
    const [quantity, setQuantity] = useState(1);
    return (
        <div className="product-card">
            <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            <p className="stock-tag">In Stock: {product.stock}</p>

            <div className="home-qty-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button 
                    onClick={() => setQuantity(q => q < product.stock ? q + 1 : q)}
                    disabled={quantity >= product.stock}
                >+</button>
            </div>

            <button
                className="add-to-cart-btn"
                disabled={product.stock <= 0}
                onClick={() => {
                    onAdd(product, quantity);
                    setQuantity(1); // Reset to 1 after adding
                }}
            >
                {product.stock > 0 ? "Add to Cart" : 'Out of Stock'}
            </button>
        </div>
    );
};

const Home = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const { items, isLoading: productsLoading, error } = useAppSelector((state) => state.products);
    //const cartItems = useAppSelector((state) => state.cart.items); // Specifically get cart items for the counter

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const getDisplayName = () => {
        if (authLoading) return '...';
        // Check user_metadata first, then email, then fallback
        return user?.full_name || user?.email || 'Guest';
    };

    return (
        <div className="home-container">
            <Navbar />
            <header className="home-hero">
                {/* Fixed the name display logic */}
                <h1>
                    {isAuthenticated ? `Welcome back, ${getDisplayName()}` : 'Welcome to Our Store'}
                    {/* {isAuthenticated && <button onClick={handleLogout} className="logout-btn">Logout</button>} */}
                </h1>
                <p>Quality products, delivered to you.</p>
            </header>

            <main className="content-area">
                {(productsLoading || authLoading) && (
                    <div className="status-message">
                        <div className="spinner"></div>
                        <p>Syncing with store...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <p>⚠️ Error: {error}</p>
                        <button onClick={() => dispatch(fetchProducts())}>Try Again</button>
                    </div>
                )}

                {!productsLoading && items.length === 0 && !error && (
                    <div className="empty-state">
                        <h3>No products found.</h3>
                        <p>Visit the Admin page to add your first item!</p>
                    </div>
                )}

                <div className="product-grid">
                    {items.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAdd={(p, q) => dispatch(addToCart({ ...p, quantity: q }))}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;