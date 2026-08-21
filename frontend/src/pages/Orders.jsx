import { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiCall('/orders');
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiCall(`/orders/${id}/update`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Orders</h1>
        <Link to="/orders/new" className="btn btn-primary">
          + Create Order
        </Link>
      </div>

      <div className="mb-4 flex gap-4">
        <button className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('ALL')}>All</button>
        <button className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('PENDING')}>Pending</button>
        <button className={`btn ${filter === 'COMPLETED' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('COMPLETED')}>Completed</button>
        <button className={`btn ${filter === 'CANCELLED' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('CANCELLED')}>Cancelled</button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Requirement</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid var(--surface-border)' }}>
                <td style={{ padding: '1rem' }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>
                  {order.customer_name}<br/>
                  <small className="text-secondary">{order.customer_phone}</small>
                </td>
                <td style={{ padding: '1rem' }}>
                  {order.requirement} {order.quantity && `(${order.quantity} ${order.unit})`}<br/>
                  <small className="text-secondary">{order.location}</small>
                </td>
                <td style={{ padding: '1rem' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem',
                    background: order.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : order.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: order.status === 'PENDING' ? 'var(--warning)' : order.status === 'COMPLETED' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {order.status === 'PENDING' && (
                    <div className="flex gap-4">
                      <button className="btn btn-outline mb-1 text-success" onClick={() => handleStatusChange(order.id, 'COMPLETED')} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Complete</button>
                      <button className="btn btn-outline text-danger" onClick={() => handleStatusChange(order.id, 'CANCELLED')} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
