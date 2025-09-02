import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Home, Package, Settings, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import OffersCarousel from '@/components/OffersCarousel';
import BottomNavBar from '@/components/BottomNavBar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  rating_count: number;
  stock: number;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products, offers, and site settings in parallel
        const [productsResult, offersResult, settingsResult] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('offers').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
        ]);

        if (productsResult.data) {
          setProducts(productsResult.data);
          setFilteredProducts(productsResult.data);
        }
        
        if (offersResult.data) {
          setOffers(offersResult.data);
        }
        
        if (settingsResult.data) {
          setSiteSettings(settingsResult.data);
          // Apply theme colors
          applyThemeColors(settingsResult.data);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyThemeColors = (settings: any) => {
    if (!settings) return;
    
    const root = document.documentElement;
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    if (settings.primary_color) {
      root.style.setProperty('--primary', hexToHsl(settings.primary_color));
    }
    if (settings.secondary_color) {
      root.style.setProperty('--accent', hexToHsl(settings.secondary_color));
    }
  };

  // Filter and search products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1
        }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background rtl">
      {/* Top Header */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        {siteSettings?.site_name || 'زهرة التوحيد'} - للحصول على أفضل منتج
      </div>
      
      {/* Header with Search */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <img 
              src={siteSettings?.site_logo || '/src/assets/logo.png'} 
              alt="Logo" 
              className="h-10 w-auto"
            />
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ابحث عن منتجك المفضلة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Offers Carousel */}
      {offers.length > 0 && <OffersCarousel offers={offers} />}

      {/* Main Products Section */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">منتجاتنا المميزة</h2>
            <p className="text-muted-foreground">
              اكتشف مجموعتنا المتنوعة من المنتجات عالية الجودة
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onQuickView={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على منتجات تطابق البحث
              </p>
              <Button onClick={() => setSearchQuery('')}>
                مسح البحث
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNavBar cartItemCount={cartItemsCount} onCartClick={() => setCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;
