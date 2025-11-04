import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const { user, loading } = useUser();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/payment/my-orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders.slice(0, 3)); // Show only 3 most recent
        }
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">Please sign in to view your account information.</p>
        <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-900">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mt-6 border-t pt-6">
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800 block mb-4"
          >
            View My Orders →
          </Link>
          <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
          {ordersLoading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map(order => (
                <li key={order._id} className="py-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-gray-700">{order._id.slice(-6)}</span>
                    <span className="text-sm text-gray-600">₹{order.totalAmount}</span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100">{order.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;