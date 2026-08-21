import { useState, useEffect } from 'react';
import { apiCall } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiCall('/orders');
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todaysOrders = orders.filter(o => o.created_at.startsWith(todayStr));
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const completedToday = todaysOrders.filter(o => o.status === 'COMPLETED');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Business Dashboard</h1>
        <Link to="/orders/new" className="btn btn-primary">
          + Create Order
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 className="text-secondary">Today's Orders</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{todaysOrders.length}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 className="text-secondary">Pending Orders</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{pendingOrders.length}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 className="text-secondary">Completed Today</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{completedToday.length}</div>
        </div>
      </div>

      <h2>Recent Orders</h2>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Requirement</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id} style={{ borderTop: '1px solid var(--surface-border)' }}>
                <td style={{ padding: '1rem' }}>#{order.id}</td>
                <td style={{ padding: '1rem' }}>{order.customer_name}</td>
                <td style={{ padding: '1rem' }}>
                  {order.requirement} &bull; {order.quantity} {order.unit}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem',
                    background: order.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: order.status === 'PENDING' ? 'var(--warning)' : 'var(--success)'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
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
