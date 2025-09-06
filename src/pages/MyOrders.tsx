import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Truck, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BottomNavBar from '@/components/BottomNavBar';

interface Order {
  id: string;
  customer: any;
  items: any[];
  totals: any;
  status: string;
  created_at: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      // In a real app, this would filter by user_id
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders((data as any) || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل طلباتك",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مطلوبة الآن': return <Clock className="h-4 w-4" />;
      case 'قيد التوصيل': return <Truck className="h-4 w-4" />;
      case 'تم التوصيل': return <Check className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مطلوبة الآن': return 'bg-blue-100 text-blue-800';
      case 'قيد التوصيل': return 'bg-yellow-100 text-yellow-800';
      case 'تم التوصيل': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">طلباتي</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">طلب #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">المنتجات:</h4>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-sm">{item.price * item.quantity} جنيه</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">المجموع الإجمالي:</span>
                    <span className="font-bold text-lg text-primary">
                      {order.totals.total} جنيه
                    </span>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="font-medium mb-1">عنوان التوصيل:</h4>
                    <p className="text-sm text-muted-foreground">{order.customer.address}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">الاسم:</span> {order.customer.name}
                    </div>
                    <div>
                      <span className="font-medium">الهاتف:</span> {order.customer.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground mb-4">
                لم تقم بأي طلبات حتى الآن
              </p>
              <Button onClick={() => navigate('/')}>
                تصفح المنتجات
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavBar cartItemCount={0} onCartClick={() => {}} />
    </div>
  );
};

export default MyOrders;