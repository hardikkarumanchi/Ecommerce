import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { removeFromCart } from '../features/cart/cartSlice';
import supabase from '../lib/supabase';
//import './Cart.css';

const Cart = () => {
    const dispatch = useAppDispatch();
    const { items, totalAmount } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    

    if (items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is lonely.</h2>
                <p>Add some products to keep it company!</p>
            </div>
        );
    }
    const handleCheckout = async ()=>
    {
        if (!user) {
            alert("Please log in to checkout");
            return;
        }
        try{
            const {data: order, error: orderError} = await supabase
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

            const {error: itemsError } = await supabase
            .from('order_items')
            .insert(orderEntries); 

            if(itemsError) throw itemsError; 

            alert("order placed sucessfully"); 

        } catch(err: any){
            alert("checkout failed: " + err.message); 
        }
    }; 
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
                <Link to="/orders">redirect to orders page</Link>
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
                    <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                    
                </div>
            </div>
        </div>
    );
};

export default Cart;