import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="group hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-32 sm:h-40 object-cover"
        />
        
        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs">
              نفد المخزون
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
            {product.price} جنيه
          </span>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
            onClick={() => onQuickView(product)}>
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.rating_count})
          </span>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={product.stock <= 0}
          className="w-full text-xs h-8"
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          أضف للسلة
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;