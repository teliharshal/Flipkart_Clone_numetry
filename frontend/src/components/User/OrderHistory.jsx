import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../actions/orderAction';
import OrderItem from '../Order/OrderItem';
import Loader from '../Layouts/Loader';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleReorder = (order) => {
        // Implementation for reorder functionality
        // This would typically add all items from the order back to cart
        console.log("Reorder items from order:", order.id);
    };

    if (loading) return <Loader />;

    return (
        <div className="order-history">
            <div className="orders-list">
                {orders && orders.map((order) => (
                    <div key={order._id} className="order-card" onClick={() => handleOrderClick(order)}>
                        <div className="order-header">
                            <div className="order-date">
                                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="order-status">
                                Status: <span className={`status-${order.orderStatus.toLowerCase()}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                        <div className="order-items">
                            {order.orderItems.map((item) => (
                                <OrderItem key={item._id} item={item} />
                            ))}
                        </div>
                        <div className="order-footer">
                            <div className="order-total">
                                Total: ₹{order.totalPrice}
                            </div>
                            <div className="order-payment">
                                Payment Method: {order.paymentMethod}
                            </div>
                            <button 
                                className="reorder-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReorder(order);
                                }}
                            >
                                Reorder
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOrder && (
                <div className="order-details-modal">
                    <div className="modal-content">
                        <h3>Order Details</h3>
                        <div className="order-info">
                            <p>Order ID: {selectedOrder._id}</p>
                            <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                            <p>Status: {selectedOrder.orderStatus}</p>
                            <p>Payment Method: {selectedOrder.paymentMethod}</p>
                            <p>Shipping Address: {selectedOrder.shippingInfo.address}</p>
                        </div>
                        <div className="order-items-list">
                            {selectedOrder.orderItems.map((item) => (
                                <div key={item._id} className="order-item-detail">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-summary">
                            <p>Subtotal: ₹{selectedOrder.itemsPrice}</p>
                            <p>Shipping: ₹{selectedOrder.shippingPrice}</p>
                            <p>Tax: ₹{selectedOrder.taxPrice}</p>
                            <p className="total">Total: ₹{selectedOrder.totalPrice}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
