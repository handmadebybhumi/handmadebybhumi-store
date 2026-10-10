import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Package, Home, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Wishlist", path: createPageUrl("Wishlist"), icon: Heart },
    { name: "Cart", path: createPageUrl("Cart"), icon: ShoppingCart, badge: cartCount }
  ];

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

      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D97757] to-[#C55E3F] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B6F47] tracking-tight">Handmade By Bhumi</h1>
                <p className="text-xs text-gray-500">Crafted with Love & Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.name} to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`relative ${
                        isActive 
                          ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white' 
                          : 'text-gray-700 hover:text-[#D97757] hover:bg-[#FFF8F0]'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                      {item.badge > 0 && (
                        <Badge className="ml-2 bg-white text-[#D97757] hover:bg-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          isActive 
                            ? 'bg-[#D97757] hover:bg-[#C55E3F] text-white' 
                            : 'text-gray-700 hover:text-[#D97757] hover:bg-[#FFF8F0]'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                        {item.badge > 0 && (
                          <Badge className="ml-auto bg-white text-[#D97757]">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#8B6F47] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6" />
                <h3 className="text-xl font-bold">Handmade By Bhumi</h3>
              </div>
              <p className="text-white/80">
                Handcrafted crochet items made with love and care. Each piece is unique and created with premium yarn.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to={createPageUrl("Home")} className="hover:text-white">Shop</Link></li>
                <li><Link to={createPageUrl("Wishlist")} className="hover:text-white">Wishlist</Link></li>
                <li><Link to={createPageUrl("Cart")} className="hover:text-white">Cart</Link></li>
                <li><Link to={createPageUrl("AdminLogin")} className="hover:text-white">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-white/80">
                Email: hello@handmadebybhumi.com<br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2025 Handmade By Bhumi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}