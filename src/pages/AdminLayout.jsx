import React from 'react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Package, LogOut, ArrowLeft, LayoutGrid, ShoppingBag, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }) {
  const { isAdmin, loading, admin, signOut } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <Package className="w-12 h-12 text-[#D97757] animate-pulse" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={createPageUrl('AdminLogin')} replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <style>
        {`
          :root {
            --color-primary: #D97757;
            --color-primary-dark: #C55E3F;
            --color-secondary: #8B6F47;
            --color-cream: #FAF9F7;
            --color-warm-white: #FFF8F0;
          }
        `}
      </style>

      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D97757] to-[#C55E3F] flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#8B6F47]">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">{admin?.email || 'Administrator'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('AdminDashboard')}>
                <Button
                  variant={window.location.pathname === createPageUrl('AdminDashboard') ? 'default' : 'ghost'}
                  className={window.location.pathname === createPageUrl('AdminDashboard')
                    ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                    : 'text-gray-700 hover:text-[#D97757]'}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl('AdminOrders')}>
                <Button
                  variant={window.location.pathname === createPageUrl('AdminOrders') || window.location.pathname === createPageUrl('AdminOrderDetail') ? 'default' : 'ghost'}
                  className={window.location.pathname === createPageUrl('AdminOrders') || window.location.pathname === createPageUrl('AdminOrderDetail')
                    ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                    : 'text-gray-700 hover:text-[#D97757]'}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link to={createPageUrl('AdminCustomers')}>
                <Button
                  variant={window.location.pathname === createPageUrl('AdminCustomers') ? 'default' : 'ghost'}
                  className={window.location.pathname === createPageUrl('AdminCustomers')
                    ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                    : 'text-gray-700 hover:text-[#D97757]'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
              </Link>
              <Link to={createPageUrl('AdminProducts')}>
                <Button
                  variant={window.location.pathname === createPageUrl('AdminProducts') || window.location.pathname === createPageUrl('AdminProductEdit') ? 'default' : 'ghost'}
                  className={window.location.pathname === createPageUrl('AdminProducts') || window.location.pathname === createPageUrl('AdminProductEdit')
                    ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white'
                    : 'text-gray-700 hover:text-[#D97757]'}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" className="text-gray-700 hover:text-[#D97757]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View Store
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleSignOut} className="text-gray-700 hover:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
