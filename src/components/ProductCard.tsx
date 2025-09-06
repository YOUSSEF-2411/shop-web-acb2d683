import React from 'react';
import { Heart, Star, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  return (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => onQuickView(product)}
        />
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/90 hover:bg-white"
              onClick={() => onQuickView(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onAddToCart(product)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Wishlist button */}
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Stock badge */}
        {product.stock < 10 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            متبقي {product.stock}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 
          className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-green-600 transition-colors"
          onClick={() => onQuickView(product)}
        >
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 mr-1">({product.rating_count})</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-green-600 text-lg">{product.price}</span>
            <span className="text-gray-600 text-sm mr-1">ج.م</span>
          </div>
          <Button 
            size="sm" 
            className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onAddToCart(product)}
          >
            إضافة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;