import { useAppDispatch, useAppSelector } from '../app/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import supabase from '../lib/supabase';
import './cart.css';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <Navbar />
                <div className="cart-empty">
                    <h2>Your cart is lonely.</h2>
                    <p>Add some products to keep it company!</p>
                    <Link to="/home" className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '10px 30px' }}>
                        Go Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleCheckout = async () => {
        if (!user) {
            
            const goToLogin = window.confirm("Please log in to checkout. Click OK to go to the Login page.");

            if (goToLogin) {
                navigate('/login'); 
            }
            return; 
        }

        try {

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_amount: totalAmount
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderEntries = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderEntries);

            if (itemsError) throw itemsError;


            for (const item of items) {
                const { data: currentProduct } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.id)
                    .single();

                if (currentProduct) {
                    await supabase
                        .from('products')
                        .update({ stock: currentProduct.stock - item.quantity })
                        .eq('id', item.id);
                }
            }

            alert("Order placed successfully! Stock has been updated.");
            dispatch(clearCart());
            navigate('/orders');

        } catch (err: any) {
            alert("Checkout failed: " + err.message);
        }
    };

    return (
        <div className="cart-page">
            <Navbar />

            <h1>Your Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {items.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.name} />
                            <div className="item-info">
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="item-price-label">${item.price} each</p>
                                </div>

                                <div className="cart-item-controls">
                                    {/* If quantity is 1, show Delete button. If more than 1, show Minus button */}
                                    {item.quantity === 1 ? (
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="qty-delete-btn"
                                            title="Remove item"
                                        >
                                            🗑️
                                        </button>
                                    ) : (
                                        <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                                            −
                                        </button>
                                    )}

                                    <span className="qty-display">{item.quantity}</span>

                                    <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                                        +
                                    </button>

                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Summary</h3>
                    <div className="summary-item-list">
                        {items.map((item) => (
                            <div key={item.id} className="summary-item-row">
                                <div className="summary-item-details">
                                    <span className="summary-item-name">{item.name}</span>
                                    <span className="summary-item-qty">x{item.quantity}</span>
                                </div>
                                <span className="summary-item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                        <span>Total Items</span>
                        <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>

                    <div className="summary-row total">
                        <span>Total Price</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                    <Link to="/orders" className="orders-link">View Order History</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;