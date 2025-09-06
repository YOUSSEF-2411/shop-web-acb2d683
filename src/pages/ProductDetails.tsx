import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BottomNavBar from '@/components/BottomNavBar';

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

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل تفاصيل المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (product) {
      // Get existing cart items from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      toast({
        title: "تم إضافة المنتج",
        description: `تم إضافة ${quantity} من ${product.title} إلى السلة`
      });
    }
  };

  const submitReview = async () => {
    // This would typically save to a reviews table
    toast({
      title: "شكراً لك",
      description: "تم إرسال تقييمك بنجاح"
    });
    setNewReview('');
    setNewRating(5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
        <Button onClick={() => navigate('/')}>العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold truncate">{product.title}</h1>
          <div className="mr-auto flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-80 object-cover"
          />
        </Card>

        {/* Product Info */}
        <Card>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-3">{product.category}</Badge>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating_count} تقييم)
              </span>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-6">
              {product.price} جنيه
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge variant="default">متوفر ({product.stock} قطعة)</Badge>
              ) : (
                <Badge variant="destructive">نفد المخزون</Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">الكمية:</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button 
              onClick={addToCart}
              disabled={product.stock <= 0}
              className="w-full mb-4"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              إضافة إلى السلة
            </Button>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">التقييمات والمراجعات</h3>
            
            {/* Add Review */}
            <div className="border-b pb-4 mb-4">
              <h4 className="font-medium mb-3">أضف تقييمك</h4>
              
              {/* Star Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewRating(i + 1)}
                    className={`p-1`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < newRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <Textarea
                placeholder="شارك تجربتك مع هذا المنتج..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="mb-3"
              />
              
              <Button onClick={submitReview}>إرسال التقييم</Button>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="font-medium">أحمد محمد</span>
                </div>
                <p className="text-muted-foreground">منتج ممتاز وجودة عالية، أنصح بشرائه</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavBar cartItemCount={0} onCartClick={() => {}} />
    </div>
  );
};

export default ProductDetails;