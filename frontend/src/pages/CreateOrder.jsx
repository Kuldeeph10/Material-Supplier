import { useState } from 'react';
import { apiCall } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    requirement: '',
    quantity: '',
    unit: '',
    location: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-4">Create New Order</h1>
      
      {error && <div className="text-danger mb-4 glass-panel" style={{ padding: '1rem', borderLeft: '4px solid var(--danger)' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
        <h3 className="mb-4" style={{ color: 'var(--primary-color)' }}>Customer Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input type="text" className="form-input" name="customer_name" value={formData.customer_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input type="tel" className="form-input" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required />
          </div>
        </div>

        <h3 className="mb-4 mt-4" style={{ color: 'var(--primary-color)', marginTop: '2rem' }}>Order Details</h3>
        
        <div className="form-group">
          <label className="form-label">Requirement (e.g. Sand, Bricks, JCB) *</label>
          <input type="text" className="form-input" name="requirement" value={formData.requirement} onChange={handleChange} required />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input type="number" step="0.01" className="form-input" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Unit (e.g. Tractor, Pieces)</label>
            <input type="text" className="form-input" name="unit" value={formData.unit} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery / Work Location</label>
          <input type="text" className="form-input" name="location" value={formData.location} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Order'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/orders')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
