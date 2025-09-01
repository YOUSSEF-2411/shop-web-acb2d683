-- Create site settings table for admin control
CREATE TABLE IF NOT EXISTS public.site_settings (
  id SERIAL PRIMARY KEY,
  site_name TEXT DEFAULT 'زهرة التوحيد',
  site_logo TEXT DEFAULT '/src/assets/logo.png',
  primary_color TEXT DEFAULT '#16a34a',
  secondary_color TEXT DEFAULT '#84cc16',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  hero_title TEXT DEFAULT 'أطلق إبداعك مع أدوات الذكاء الاصطناعي', 
  hero_subtitle TEXT DEFAULT 'مع أدوات الذكاء الاصطناعي من زهرة التوحيد يمكنك فعل كل شيء وإظهار إبداعك بلا حدود واشتراكات حصرية',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Only authenticated users can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (true);

-- Insert default settings
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();