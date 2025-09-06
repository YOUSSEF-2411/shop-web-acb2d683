import React from 'react';
import { Home, ShoppingCart, Package, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BottomNavBarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ cartItemCount, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/', action: () => navigate('/') },
    { icon: ShoppingCart, label: 'سلتي', path: '/cart', action: onCartClick, count: cartItemCount },
    { icon: Package, label: 'طلباتي', path: '/orders', action: () => navigate('/my-orders') },
    { icon: User, label: 'المفضلة', path: '/favorites', action: () => {} },
    { icon: Menu, label: 'القائمة', path: '/menu', action: () => {} },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path === '/cart' && false);
          return (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-16 relative ${
                isActive ? 'text-green-600' : 'text-gray-600'
              }`}
              onClick={item.action}
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.count && item.count > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
                    {item.count}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavBar;