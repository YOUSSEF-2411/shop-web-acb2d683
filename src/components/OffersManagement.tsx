import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
}

const OffersManagement: React.FC = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل العروض",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveOffer = async () => {
    if (!newOffer.title || !newOffer.description) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء العنوان والوصف على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          title: newOffer.title,
          description: newOffer.description,
          image: newOffer.image || null
        } as any)
        .select()
        .single();

      if (error) throw error;

      setOffers([data, ...offers]);
      setNewOffer({ title: '', description: '', image: '' });

      toast({
        title: "تم إضافة العرض",
        description: "تم إضافة العرض الجديد بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر إضافة العرض",
        variant: "destructive"
      });
    }
  };

  const updateOffer = async () => {
    if (!editingOffer) return;

    try {
      const { data, error } = await supabase
        .from('offers')
        .update(editingOffer)
        .eq('id', editingOffer.id)
        .select()
        .single();

      if (error) throw error;

      setOffers(offers.map(offer => 
        offer.id === editingOffer.id ? data : offer
      ));
      setEditingOffer(null);

      toast({
        title: "تم التحديث",
        description: "تم تحديث العرض بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر تحديث العرض",
        variant: "destructive"
      });
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', parseInt(offerId));

      if (error) throw error;

      setOffers(offers.filter(offer => offer.id.toString() !== offerId));

      toast({
        title: "تم الحذف",
        description: "تم حذف العرض بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "تعذر حذف العرض",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">جاري تحميل العروض...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة عرض جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="offer-title">عنوان العرض</Label>
            <Input
              id="offer-title"
              value={newOffer.title}
              onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
              placeholder="أدخل عنوان العرض"
            />
          </div>
          
          <div>
            <Label htmlFor="offer-description">وصف العرض</Label>
            <Textarea
              id="offer-description"
              value={newOffer.description}
              onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
              placeholder="أدخل وصف العرض"
            />
          </div>
          
          <div>
            <Label htmlFor="offer-image">رابط الصورة</Label>
            <Input
              id="offer-image"
              value={newOffer.image}
              onChange={(e) => setNewOffer({...newOffer, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <Button onClick={saveOffer} className="w-full">
            إضافة العرض
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>العروض المتاحة ({offers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => (
                <Card key={offer.id} className="relative">
                  <CardContent className="p-4">
                    {offer.image && (
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold mb-2">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{offer.description}</p>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingOffer(offer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تعديل العرض</DialogTitle>
                          </DialogHeader>
                          {editingOffer && (
                            <div className="space-y-4">
                              <div>
                                <Label>عنوان العرض</Label>
                                <Input
                                  value={editingOffer.title}
                                  onChange={(e) => setEditingOffer({
                                    ...editingOffer,
                                    title: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div>
                                <Label>وصف العرض</Label>
                                <Textarea
                                  value={editingOffer.description}
                                  onChange={(e) => setEditingOffer({
                                    ...editingOffer,
                                    description: e.target.value
                                  })}
                                />
                              </div>
                              
                              <div>
                                <Label>رابط الصورة</Label>
                                <Input
                                  value={editingOffer.image}
                                  onChange={(e) => setEditingOffer({
                                    ...editingOffer,
                                    image: e.target.value
                                  })}
                                />
                              </div>
                              
                              <Button onClick={updateOffer} className="w-full">
                                حفظ التغييرات
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOffer(offer.id.toString())}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد عروض حالياً
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersManagement;