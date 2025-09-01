import React from 'react';
import { ArrowRight, ShoppingBag, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-hero min-h-[600px] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-primary-foreground leading-tight">
              أطلق إبداعك
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                مع أدوات الذكاء الاصطناعي
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-lg mx-auto lg:mx-0">
              مع أدوات الذكاء الاصطناعي من زهرة التوحيد يمكنك فعل كل شيء وإظهار إبداعك بلا حدود واشتراكات حصرية.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8">
                ابدأ التسوق الآن
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
                تعرف على المزيد
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">10K+</div>
                <div className="text-primary-foreground/80 text-sm">عملاء سعداء</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">1K+</div>
                <div className="text-primary-foreground/80 text-sm">اشتراكات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">99%</div>
                <div className="text-primary-foreground/80 text-sm">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* Features Cards */}
          <div className="grid gap-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-accent p-3 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">تسوق سهل</h3>
                    <p className="text-primary-foreground/80 text-sm">اشتراك سهل وآمن</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-warning p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">الدعم الفني</h3>
                    <p className="text-primary-foreground/80 text-sm">1-2 يوم عمل</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-success p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">دفع آمن</h3>
                    <p className="text-primary-foreground/80 text-sm">تشفير SSL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
