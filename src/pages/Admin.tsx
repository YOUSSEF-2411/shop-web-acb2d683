import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, Plus, Eye, EyeOff, Settings, Package, FileText, Lock, Store } from 'lucide-react';
import AdminSettings from '@/components/AdminSettings';

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
  created_at?: string;
}

interface ThemeSettings {
  id: number;
  primary_hex: string;
  accent_hex: string;
  hero_h1: string;
  hero_p: string;
  updated_at?: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    id: 1,
    primary_hex: '#16a34a',
    accent_hex: '#84cc16',
    hero_h1: 'أطلق إبداعك مع أدوات الذكاء الاصطناعي',
    hero_p: 'مع أدوات الذكاء الاصطناعي من زهرة التوحيد يمكنك فعل كل شيء وإظهار إبداعك بلا حدود واشتراكات حصرية'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchThemeSettings();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Yy654321##') {
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      toast({
        title: "كلمة مرور خاطئة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: "خطأ في تحميل المنتجات",
        description: "تعذر تحميل المنتجات من قاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setThemeSettings(data);
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error);
    }
  };

  const saveProduct = async () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price || parseFloat(newProduct.price) <= 0) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          id: crypto.randomUUID(),
          title: newProduct.title,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image: newProduct.image,
          category: newProduct.category,
          stock: parseInt(newProduct.stock) || 0,
          rating: 4.5,
          rating_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });

      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "تم إضافة المنتج الجديد إلى المتجر",
      });
    } catch (error) {
      toast({
        title: "خطأ في إضافة المنتج",
        description: "تعذر إضافة المنتج إلى قاعدة البيانات",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .update(editingProduct)
        .eq('id', editingProduct.id)
        .select()
        .single();

      if (error) throw error;

      setProducts(products.map(p => p.id === editingProduct.id ? data : p));
      setEditingProduct(null);

      toast({
        title: "تم تحديث المنتج بنجاح",
        description: "تم حفظ التغييرات",
      });
    } catch (error) {
      toast({
        title: "خطأ في تحديث المنتج",
        description: "تعذر حفظ التغييرات",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));

      toast({
        title: "تم حذف المنتج بنجاح",
        description: "تم إزالة المنتج من المتجر",
      });
    } catch (error) {
      toast({
        title: "خطأ في حذف المنتج",
        description: "تعذر حذف المنتج",
        variant: "destructive",
      });
    }
  };

  const saveThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme')
        .upsert([themeSettings])
        .select()
        .single();

      if (error) throw error;

      setThemeSettings(data);
      
      // Update CSS variables
      const root = document.documentElement;
      root.style.setProperty('--primary', `hsl(from ${themeSettings.primary_hex} h s l)`);
      root.style.setProperty('--accent', `hsl(from ${themeSettings.accent_hex} h s l)`);

      toast({
        title: "تم حفظ إعدادات التصميم",
        description: "تم تطبيق الألوان الجديدة",
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "تعذر حفظ إعدادات التصميم",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl font-bold">لوحة التحكم</CardTitle>
            <CardDescription>
              أدخل كلمة المرور للوصول إلى لوحة التحكم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                دخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Store className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground">إدارة المتجر الإلكتروني</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsAuthenticated(false)}
            >
              تسجيل خروج
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              التصميم
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  إضافة منتج جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">عنوان المنتج</Label>
                  <Input
                    id="title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    placeholder="أدخل عنوان المنتج"
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="أدخل فئة المنتج"
                  />
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">الكمية المتاحة</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">وصف المنتج</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="أدخل وصف المنتج"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="image">رابط الصورة</Label>
                  <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={saveProduct} className="w-full">
                    إضافة المنتج
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>المنتجات المتاحة ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">جاري تحميل المنتجات...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="relative">
                        <CardContent className="p-4">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-full h-32 object-cover rounded-md mb-3"
                            />
                          )}
                          <h3 className="font-semibold mb-2">{product.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <Badge variant="secondary">{product.category}</Badge>
                            <span className="font-bold text-lg">${product.price}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلبات</CardTitle>
                <CardDescription>عرض وإدارة طلبات العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد طلبات حالياً
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings onSettingsUpdate={setSiteSettings} />
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>معاينة التصميم</CardTitle>
                <CardDescription>معاينة شكل الموقع بالإعدادات الحالية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  لمعاينة التصميم، قم بتحديث الإعدادات من تبويب "الإعدادات" ثم اذهب إلى الصفحة الرئيسية
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>تعديل المنتج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit_title">عنوان المنتج</Label>
                <Input
                  id="edit_title"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_price">السعر</Label>
                <Input
                  id="edit_price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit_stock">الكمية</Label>
                <Input
                  id="edit_stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={updateProduct} className="flex-1">
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPage;