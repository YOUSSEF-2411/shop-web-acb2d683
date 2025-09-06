import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart, Grid3X3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemCount: number;
  onCartClick: () => void;
  siteSettings?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  searchQuery,
  onSearchChange,
  cartItemCount,
  onCartClick,
  siteSettings
}) => {
  const categories = [
    'جميع الفئات', 'الرياضة', 'منقوشات', 'آثات', 'أدوات منزلية', 'أجهزة كهربائية', 'فاشون'
  ];

  return (
    <div className="hidden md:block">
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm">
        الموقع الحالي - للحصول على أفضل منتج
      </div>
      
      {/* Main Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={siteSettings?.site_logo || '/src/assets/logo.png'} 
                alt="Logo" 
                className="h-12 w-auto"
              />
              <div className="mr-3">
                <h1 className="text-xl font-bold text-green-600">زهرة التوحيد</h1>
                <p className="text-xs text-gray-500">للحصول على كل شيء جميل</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  placeholder="ابحث عن منتجك المفضل..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-12 h-12 rounded-full border-2 border-green-200 focus:border-green-500"
                />
                <Button 
                  size="sm" 
                  className="absolute left-2 top-2 h-8 rounded-full bg-green-600 hover:bg-green-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">0</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-4">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center cursor-pointer group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors">
                  <Grid3X3 className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
                </div>
                <span className="text-xs text-center text-gray-700 group-hover:text-green-600">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;