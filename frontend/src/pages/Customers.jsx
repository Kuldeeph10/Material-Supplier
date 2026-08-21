import { useState, useEffect } from 'react';
import { apiCall } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiCall('/customers');
        setCustomers(data || []);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <h1 className="mb-4">Customers Directory</h1>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Phone</th>
              <th style={{ padding: '1rem' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={{ borderTop: '1px solid var(--surface-border)' }}>
                <td style={{ padding: '1rem' }}>#{customer.id}</td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{customer.name}</td>
                <td style={{ padding: '1rem' }}>{customer.phone}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
