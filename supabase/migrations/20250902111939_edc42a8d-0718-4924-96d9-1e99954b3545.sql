-- Create orders table for managing orders
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT,
  email TEXT,
  status TEXT DEFAULT 'قيد المعالجة',
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  totals JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_write" ON public.orders FOR INSERT WITH CHECK (true);

-- Create offers table for carousel
CREATE TABLE public.offers (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create referral_posts table for affiliate offers
CREATE TABLE public.referral_posts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  link TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wallet table for user wallet
CREATE TABLE public.wallet (
  user_id TEXT PRIMARY KEY,
  balance NUMERIC DEFAULT 0
);