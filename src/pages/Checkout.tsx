import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    secondPhone: '',
    address: '',
    floor: '',
    city: '',
    notes: ''
  });

  useEffect(() => {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات إلى السلة أولاً",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        id: `ORDER-${Date.now()}`,
        customer: customerInfo,
        items: cartItems,
        totals: {
          subtotal: totalAmount,
          shipping: 50,
          total: totalAmount + 50
        },
        status: 'مطلوبة الآن',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .insert([{
          id: orderData.id,
          customer: orderData.customer as any,
          items: orderData.items as any,
          totals: orderData.totals as any,
          status: orderData.status
        }]);

      if (error) throw error;

      // Clear cart
      localStorage.removeItem('cart');
      
      toast({
        title: "تم إرسال الطلب",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب"
      });

      navigate('/order-success');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">إتمام الطلب</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  معلومات التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="01234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="secondPhone">رقم هاتف إضافي</Label>
                  <Input
                    id="secondPhone"
                    value={customerInfo.secondPhone}
                    onChange={(e) => handleInputChange('secondPhone', e.target.value)}
                    placeholder="رقم بديل للتواصل"
                  />
                </div>

                <div>
                  <Label htmlFor="address">العنوان التفصيلي *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="أدخل عنوانك التفصيلي"
                  />
                </div>

                <div>
                  <Label htmlFor="floor">الطابق</Label>
                  <Input
                    id="floor"
                    value={customerInfo.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    placeholder="رقم الطابق"
                  />
                </div>

                <div>
                  <Label htmlFor="city">المدينة *</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="أدخل اسم المدينة"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="أي ملاحظات خاصة بالطلب"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {item.price * item.quantity} جنيه
                      </div>
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>{totalAmount} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span>رسوم التوصيل:</span>
                      <span>50 جنيه</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>المجموع الإجمالي:</span>
                      <span>{totalAmount + 50} جنيه</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  طريقة الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CreditCard className="h-5 w-5" />
                  <span>الدفع عند الاستلام</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  يمكنك الدفع نقداً عند وصول الطلب
                </p>
              </CardContent>
            </Card>

            <Button 
              onClick={submitOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;