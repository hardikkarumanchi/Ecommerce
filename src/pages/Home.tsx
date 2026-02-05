import { useEffect } from 'react'; 
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts } from '../features/products/productSlice';
import './Home.css';
import { addToCart } from '../features/cart/cartSlice';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useAppDispatch();

    // 1. Get Auth and Product state from Redux
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { items, isLoading, error } = useAppSelector((state) => state.products);

    // 2. Fetch data from Supabase on component mount
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="home-container">
            <header className="home-hero">
                <h1>{isAuthenticated ? `Welcome back, ${user?.full_name}` : 'Welcome to Our Store'}</h1>
                <p>Quality products, delivered to you.</p>
            </header>
            <nav className="temp-navigation">
                {user?.role === 'admin' && (
                    <Link to="/admin" className="admin-link">Admin Dashboard</Link>
                )} 
                
                <Link to="/cart" className="cart-link">
                    View Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
                </Link>
            </nav>

            <main className="content-area">
                {isLoading && (
                    <div className="status-message">
                        <div className="spinner"></div>
                        <p>Fetching the latest deals...</p>
                    </div>
                )}

                {/* 2. Error State */}
                {error && (
                    <div className="error-message">
                        <p>⚠️ Error: {error}</p>
                        <button onClick={() => dispatch(fetchProducts())}>Try Again</button>
                    </div>
                )}

                {/* 3. Empty State (No products in DB yet) */}
                {!isLoading && items.length === 0 && !error && (
                    <div className="empty-state">
                        <h3>No products found.</h3>
                        <p>Visit the Admin page to add your first item!</p>
                    </div>
                )}

                {/* 4. The Product Grid */}
                <div className="product-grid">
                    {items.map((product: any) => (
                        <div key={product.id} className="product-card">
                            {/* Fallback image if image_url is missing */}
                            <img
                                src={product.image_url || 'https://via.placeholder.com/150'}
                                alt={product.name}
                            />
                            <h3>{product.name}</h3>
                            {/* Added Number() check to prevent toFixed errors if price comes as string */}
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