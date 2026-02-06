import { useEffect } from 'react'; 
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productSlice';
import './Home.css';
import { addToCart } from '../features/cart/cartSlice';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useAppDispatch();

    // 1. Grab Auth (with loading) and Product state
    const { isAuthenticated, user, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const { items, isLoading: productsLoading, error } = useAppSelector((state) => state.products);
    const cartItems = useAppSelector((state) => state.cart.items); // Specifically get cart items for the counter

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Helper to get the display name safely
    const getDisplayName = () => {
        if (authLoading) return '...';
        // Check user_metadata first, then email, then fallback
        return user?.full_name || user?.email || 'Guest';
    };

    return (
        <div className="home-container">
            <header className="home-hero">
                {/* Fixed the name display logic */}
                <h1>
                    {isAuthenticated ? `Welcome back, ${getDisplayName()}` : 'Welcome to Our Store'}
                </h1>
                <p>Quality products, delivered to you.</p>
            </header>

            <nav className="temp-navigation">
                {/* Added user metadata check for role if needed */}
                {(user?.role === 'admin') && (
                    <Link to="/admin" className="admin-link">Admin Dashboard</Link>
                )} 
                
                <Link to="/orders" className="orders-link">My Orders</Link>

                <Link to="/cart" className="cart-link">
                    {/* Fixed counter to use cartItems specifically */}
                    View Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </Link>
            </nav>

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
                    {items.map((product: any) => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/150'}
                                alt={product.name}
                            />
                            <h3>{product.name}</h3>
                            <p className="price">${Number(product.price).toFixed(2)}</p>
                            <button className="view-btn">View Details</button>
                            <button className="add-to-cart-btn"
                                onClick={() => dispatch(addToCart(product))}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;