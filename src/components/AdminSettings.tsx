import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Palette, Globe, Facebook, Instagram, MessageCircle, Upload } from 'lucide-react';

interface SiteSettings {
  id: number;
  site_name: string;
  site_logo: string;
  primary_color: string;
  secondary_color: string;
  facebook_url: string;
  instagram_url: string;
  whatsapp_number: string;
  hero_title: string;
  hero_subtitle: string;
}

interface AdminSettingsProps {
  onSettingsUpdate: (settings: SiteSettings) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onSettingsUpdate }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({
    id: 1,
    site_name: 'زهرة التوحيد',
    site_logo: '/src/assets/logo.png',
    primary_color: '#16a34a',
    secondary_color: '#84cc16',
    facebook_url: '',
    instagram_url: '',
    whatsapp_number: '',
    hero_title: 'أطلق إبداعك مع أدوات الذكاء الاصطناعي',
    hero_subtitle: 'مع أدوات الذكاء الاصطناعي من زهرة التوحيد يمكنك فعل كل شيء وإظهار إبداعك بلا حدود واشتراكات حصرية'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        onSettingsUpdate(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حفظ الإعدادات",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الموقع بنجاح"
      });

      onSettingsUpdate(settings);
      
      // Apply colors immediately to CSS variables
      applyColorsToCSS();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyColorsToCSS = () => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(settings.primary_color));
    root.style.setProperty('--accent', hexToHsl(settings.secondary_color));
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            إعدادات الموقع
          </CardTitle>
          <CardDescription>
            تحكم في جميع إعدادات موقعك من هنا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="appearance">المظهر</TabsTrigger>
              <TabsTrigger value="social">التواصل</TabsTrigger>
              <TabsTrigger value="content">المحتوى</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="site_name">اسم الموقع</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                    placeholder="اسم الموقع"
                  />
                </div>
                <div>
                  <Label htmlFor="site_logo">رابط الشعار</Label>
                  <Input
                    id="site_logo"
                    value={settings.site_logo}
                    onChange={(e) => handleInputChange('site_logo', e.target.value)}
                    placeholder="رابط الشعار"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5" />
                <h3 className="text-lg font-semibold">ألوان الموقع</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_color">اللون الأساسي</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      placeholder="#16a34a"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">اللون الثانوي</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      placeholder="#84cc16"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="facebook_url">رابط الفيسبوك</Label>
                </div>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />

                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Label htmlFor="instagram_url">رابط الإنستجرام</Label>
                </div>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/your-profile"
                />

                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <Label htmlFor="whatsapp_number">رقم الواتساب</Label>
                </div>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  placeholder="+201234567890"
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">عنوان الصفحة الرئيسية</Label>
                  <Input
                    id="hero_title"
                    value={settings.hero_title}
                    onChange={(e) => handleInputChange('hero_title', e.target.value)}
                    placeholder="عنوان الصفحة الرئيسية"
                  />
                </div>
                <div>
                  <Label htmlFor="hero_subtitle">وصف الصفحة الرئيسية</Label>
                  <Textarea
                    id="hero_subtitle"
                    value={settings.hero_subtitle}
                    onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                    placeholder="وصف الصفحة الرئيسية"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t">
            <Button 
              onClick={saveSettings}
              disabled={loading}
              className="w-full md:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;