import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Truck, Check, X, Package, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Order {
  id: string;
  customer: any;
  items: any[];
  totals: any;
  status: string;
  created_at: string;
}

const OrdersManagement: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل الطلبات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery)
      );
    }
    
    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          ...(reason && { cancel_reason: reason })
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      toast({
        title: "تم التحديث",
        description: `تم تحديث حالة الطلب إلى: ${newStatus}`
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر تحديث حالة الطلب",
        variant: "destructive"
      });
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

  const getOrdersByStatus = (status: string) => {
    return filteredOrders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{order.customer.name}</h4>
            <p className="text-sm text-muted-foreground">#{order.id}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="font-medium">الهاتف:</span> {order.customer.phone}
          </div>
          <div>
            <span className="font-medium">المجموع:</span> {order.totals.total} جنيه
          </div>
        </div>

        <div className="mb-3">
          <span className="font-medium text-sm">العنوان:</span>
          <p className="text-sm text-muted-foreground">{order.customer.address}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {order.status === 'مطلوبة الآن' && (
            <>
              <Button
                size="sm"
                onClick={() => updateOrderStatus(order.id, 'قيد التوصيل')}
              >
                <Truck className="h-4 w-4 mr-1" />
                قيد التوصيل
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    إلغاء
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إلغاء الطلب</DialogTitle>
                    <DialogDescription>
                      يرجى إدخال سبب إلغاء الطلب
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="اكتب سبب الإلغاء..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      updateOrderStatus(order.id, 'ملغي', cancelReason);
                      setCancelReason('');
                      setSelectedOrder(null);
                    }}
                  >
                    تأكيد الإلغاء
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}

          {order.status === 'قيد التوصيل' && (
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'تم التوصيل')}
            >
              <Check className="h-4 w-4 mr-1" />
              تم التوصيل
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                عرض التفاصيل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>تفاصيل الطلب #{order.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">المنتجات:</h4>
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{item.price * item.quantity} جنيه</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">معلومات العميل:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>الاسم:</strong> {order.customer.name}</div>
                    <div><strong>الهاتف:</strong> {order.customer.phone}</div>
                    <div><strong>البريد:</strong> {order.customer.email}</div>
                    <div><strong>المدينة:</strong> {order.customer.city}</div>
                    <div className="col-span-2"><strong>العنوان:</strong> {order.customer.address}</div>
                    {order.customer.notes && (
                      <div className="col-span-2"><strong>ملاحظات:</strong> {order.customer.notes}</div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلبات</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              إجمالي الطلبات: {orders.length}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            مطلوبة الآن ({getOrdersByStatus('مطلوبة الآن').length})
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            قيد التوصيل ({getOrdersByStatus('قيد التوصيل').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            منتهية ({getOrdersByStatus('تم التوصيل').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            ملغية ({getOrdersByStatus('ملغي').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {getOrdersByStatus('مطلوبة الآن').length > 0 ? (
            getOrdersByStatus('مطلوبة الآن').map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد طلبات مطلوبة حالياً
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          {getOrdersByStatus('قيد التوصيل').length > 0 ? (
            getOrdersByStatus('قيد التوصيل').map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد طلبات قيد التوصيل
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {getOrdersByStatus('تم التوصيل').length > 0 ? (
            getOrdersByStatus('تم التوصيل').map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد طلبات مكتملة
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {getOrdersByStatus('ملغي').length > 0 ? (
            getOrdersByStatus('ملغي').map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                لا توجد طلبات ملغية
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersManagement;