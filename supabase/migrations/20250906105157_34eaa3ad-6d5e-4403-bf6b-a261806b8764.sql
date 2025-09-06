-- Fix offers table to ensure id is properly auto-generated
DROP TABLE IF EXISTS public.offers CASCADE;

CREATE TABLE public.offers (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Create policies for offers (public read)
CREATE POLICY "offers_select" ON public.offers FOR SELECT USING (true);
CREATE POLICY "offers_write" ON public.offers FOR INSERT WITH CHECK (true);
CREATE POLICY "offers_update" ON public.offers FOR UPDATE USING (true);
CREATE POLICY "offers_delete" ON public.offers FOR DELETE USING (true);