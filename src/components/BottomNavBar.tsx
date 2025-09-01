import React from 'react';
import { Home, ShoppingCart, Heart, Menu, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavBarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ cartItemCount, onCartClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {/* الرئيسية */}
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 min-w-0">
          <Home className="h-5 w-5 text-primary" />
          <span className="text-xs text-foreground mt-1">الرئيسية</span>
        </Button>

        {/* سلتي */}
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-2 px-3 min-w-0 relative"
          onClick={onCartClick}
        >
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
              {cartItemCount}
            </span>
          )}
          <span className="text-xs text-muted-foreground mt-1">سلتي</span>
        </Button>

        {/* طلباتي */}
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 min-w-0">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1">طلباتي</span>
        </Button>

        {/* المفضلة */}
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 min-w-0">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1">المفضلة</span>
        </Button>

        {/* القائمة */}
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 min-w-0">
          <Menu className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mt-1">القائمة</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavBar;