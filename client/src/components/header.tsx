import { useState } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "@shared/schema";

interface HeaderProps {
  onSearch: (search: string) => void;
  onCartClick: () => void;
}

export default function Header({ onSearch, onCartClick }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">ShopCraft</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
          </form>

          {/* Navigation & Cart */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <a className="text-slate-600 hover:text-primary transition-colors">Home</a>
              </Link>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Products</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Categories</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">About</a>
            </nav>

            {/* Shopping Cart */}
            <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
