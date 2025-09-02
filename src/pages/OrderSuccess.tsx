import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold mb-2">تم إرسال طلبك بنجاح!</h1>
          
          <p className="text-muted-foreground mb-6">
            شكراً لك على ثقتك. سيتم التواصل معك قريباً لتأكيد الطلب وترتيب التوصيل.
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              العودة للرئيسية
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/my-orders')}
              className="w-full"
            >
              <Package className="h-4 w-4 mr-2" />
              طلباتي
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;