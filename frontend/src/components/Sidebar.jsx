import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>
        Material Supplier
      </h2>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to="/" className={`flex items-center gap-4 ${isActive('/')}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/orders" className={`flex items-center gap-4 ${isActive('/orders')}`}>
          <ShoppingCart size={20} /> Orders
        </Link>
        <Link to="/customers" className={`flex items-center gap-4 ${isActive('/customers')}`}>
          <Users size={20} /> Customers
        </Link>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
        <div className="mb-4 text-secondary" style={{ fontSize: '0.875rem' }}>
          Logged in as: <br/><strong style={{ color: 'var(--text-primary)'}}>{user?.name}</strong>
        </div>
        <button onClick={logout} className="btn btn-outline flex items-center gap-4" style={{ width: '100%' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
