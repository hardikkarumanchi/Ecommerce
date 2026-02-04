import React from 'react';
import { useAppSelector } from '../app/hooks';
import './Home.css'


const Test_Products = [
    { id: 1, name: 'Wireless Headphones', price: 99, description: 'High-quality sound' },
    { id: 2, name: 'Smart Watch', price: 199, description: 'Track your fitness' },
    { id: 3, name: 'Gaming Mouse', price: 49, description: 'Fast and precise' },
];

const Home = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    return (
        <div className='home-container'>
            <section className='hero'>
                {isAuthenticated ? (
                    <h1>Flash sale is on! Are you ready {user?.full_name || 'Shopper'} ?</h1>
                ) : (
                    <h1>Welcome to Westeros!</h1>
                )}
                <p>Find the best deals on the latest tech.</p>
            </section>

            <h2>Featured Products</h2>
            <div className="product-grid">
                {Test_Products.map((product) => (
                    <div key={product.id} className=" product-card">
                        <div className='product-image'>Product Image</div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p><strong>${product.price}</strong></p>
                        <button className='add-to-cart-btn'> Add to Cart</button>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Home; 