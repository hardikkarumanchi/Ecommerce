import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { useAppSelector } from '../app/hooks';
import './Orders.css';

const Orders = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user) return;
            
            // This query gets the order AND the nested items in one go!
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    created_at,
                    total_amount,
                    status,
                    order_items (
                        quantity,
                        price_at_purchase,
                        products (name)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error) setOrders(data);
            setLoading(false);
        };

        fetchUserOrders();
    }, [user]);

    if (loading) return <div className="loader">Loading your history...</div>;

    return (
        <div className="orders-container">
            <h1>Your Order History</h1>
            {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span>Order ID: {order.id.slice(0, 8)}...</span>
                            <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="status-tag">{order.status}</span>
                        </div>
                        <div className="order-details">
                            {order.order_items.map((item: any, index: number) => (
                                <div key={index} className="item-row">
                                    <p>{item.products.name} x {item.quantity}</p>
                                    <p>${Number(item.price_at_purchase).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="order-total">
                            <strong>Total: ${Number(order.total_amount).toFixed(2)}</strong>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;