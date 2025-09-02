import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Key, FileText, Database } from 'lucide-react';

const AdvancedSettings: React.FC = () => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const exportData = () => {
    // Get products data from localStorage or database
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const offers = JSON.parse(localStorage.getItem('offers') || '[]');
    
    const exportData = {
      products,
      offers,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `products-${new Date().toISOString().split('T')[0]}.xshop`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "تم التصدير",
      description: "تم تصدير البيانات بنجاح"
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xshop')) {
      toast({
        title: "خطأ في الملف",
        description: "يرجى اختيار ملف بامتداد .xshop",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!importData.products || !Array.isArray(importData.products)) {
          throw new Error('Invalid file format');
        }

        // Store imported data
        localStorage.setItem('products', JSON.stringify(importData.products));
        if (importData.offers) {
          localStorage.setItem('offers', JSON.stringify(importData.offers));
        }

        toast({
          title: "تم الاستيراد",
          description: "تم استيراد البيانات بنجاح. يرجى إعادة تحميل الصفحة."
        });
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: "تعذر قراءة الملف. تأكد من صحة التنسيق.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const changePassword = () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "كلمة مرور ضعيفة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمتي المرور",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would be handled by the backend
    localStorage.setItem('admin_password', newPassword);
    setNewPassword('');
    setConfirmPassword('');

    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            إدارة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">استيراد المنتجات</Label>
            <p className="text-sm text-muted-foreground mb-3">
              استيراد المنتجات من ملف .xshop
            </p>
            <Input
              type="file"
              accept=".xshop"
              onChange={handleImport}
              className="cursor-pointer"
            />
          </div>

          <div>
            <Label className="text-base font-medium">تصدير البيانات</Label>
            <p className="text-sm text-muted-foreground mb-3">
              تصدير جميع المنتجات والعروض إلى ملف .xshop
            </p>
            <Button onClick={exportData} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              تحميل products.xshop
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            تغيير كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>

          <Button onClick={changePassword} className="w-full">
            تغيير كلمة المرور
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الصفحات الإضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            المساعدة والدعم
          </Button>
          <Button variant="outline" className="w-full justify-start">
            سياسة الخصوصية
          </Button>
          <Button variant="outline" className="w-full justify-start">
            الشروط والأحكام
          </Button>
          <Button variant="outline" className="w-full justify-start">
            معلومات عن المتجر
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettings;