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
    <Card className="group bg-gradient-card hover:shadow-product transition-smooth overflow-hidden border-border/50">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth" />
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-smooth space-y-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-lg"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4">
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-secondary/90 text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
          {product.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating_count})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ${product.price}
          </div>
          
          <Button
            variant="product"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="shadow-md"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;