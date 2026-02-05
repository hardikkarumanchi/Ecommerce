import { useAppDispatch, useAppSelector } from '../app/hooks';
import { removeFromCart } from '../features/cart/cartSlice';
//import './Cart.css';

const Cart = () => {
    const dispatch = useAppDispatch();
    const { items, totalAmount } = useAppSelector((state) => state.cart);

    if (items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is lonely.</h2>
                <p>Add some products to keep it company!</p>
            </div>
        );
    }

    return (
        
        <div className="cart-page">
 
            <h1>Your Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {items.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.name} />
                            <div className="item-info">
                                <h3>{item.name}</h3>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button 
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Summary</h3>
                    <div className="summary-row">
                        <span>Total Items:</span>
                        <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Price:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn">Proceed to Checkout</button>
                    
                </div>
            </div>
        </div>
    );
};

export default Cart;