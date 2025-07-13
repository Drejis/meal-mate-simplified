-- Create meal subscription tables for MealMate app

-- Create meal plans table
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_meal DECIMAL(10,2) NOT NULL,
  meals_per_week INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create meals table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  category TEXT, -- vegan, regular, high-protein, etc.
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES meal_plans(id),
  status TEXT DEFAULT 'active', -- active, paused, cancelled
  delivery_address TEXT,
  delivery_time_slot TEXT,
  delivery_days TEXT[], -- array of days like ['monday', 'wednesday', 'friday']
  dietary_preferences TEXT[],
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create weekly meal schedule table
CREATE TABLE public.weekly_meal_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  meal_id UUID REFERENCES meals(id),
  scheduled_date DATE NOT NULL,
  is_eaten BOOLEAN DEFAULT false,
  is_skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create referral system table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  reward_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, completed, paid
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user rewards/credits table
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  source TEXT NOT NULL, -- referral, discount, bonus
  description TEXT,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create discount coupons table
CREATE TABLE public.discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table for meal subscriptions
CREATE TABLE public.meal_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  payment_method TEXT,
  delivery_date DATE,
  delivery_status TEXT DEFAULT 'scheduled', -- scheduled, preparing, delivered
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- delivery_reminder, discount_alert, referral_success
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_meal_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for meal plans and meals (public read access)
CREATE POLICY "Anyone can view meal plans" 
ON public.meal_plans FOR SELECT USING (true);

CREATE POLICY "Anyone can view meals" 
ON public.meals FOR SELECT USING (true);

-- Create RLS policies for user-specific data
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own meal schedules" 
ON public.weekly_meal_schedules FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal schedules" 
ON public.weekly_meal_schedules FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal schedules" 
ON public.weekly_meal_schedules FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own referrals" 
ON public.referrals FOR SELECT USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can insert referrals" 
ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "Users can view their own credits" 
ON public.user_credits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits" 
ON public.user_credits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active discount coupons" 
ON public.discount_coupons FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own orders" 
ON public.meal_orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
ON public.meal_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" 
ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weekly_meal_schedules_updated_at
  BEFORE UPDATE ON public.weekly_meal_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_coupons_updated_at
  BEFORE UPDATE ON public.discount_coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meal_orders_updated_at
  BEFORE UPDATE ON public.meal_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for meal plans
INSERT INTO public.meal_plans (name, description, price_per_meal, meals_per_week) VALUES
('Daily Delight', 'Fresh Nigerian meals delivered daily', 2500, 7),
('Weekday Wonder', 'Perfect for busy weekdays', 2800, 5),
('Weekend Special', 'Premium meals for weekends', 3200, 2);

-- Insert sample Nigerian meals
INSERT INTO public.meals (name, description, image_url, calories, protein, carbs, fat, category) VALUES
('Jollof Rice with Grilled Chicken', 'Classic Nigerian jollof rice with perfectly grilled chicken and plantain', '/api/placeholder/400/300', 650, 35.5, 75.2, 18.3, 'regular'),
('Egusi Soup with Pounded Yam', 'Traditional egusi soup made with melon seeds and assorted meat', '/api/placeholder/400/300', 580, 28.7, 45.8, 22.1, 'regular'),
('Pepper Soup with Catfish', 'Spicy Nigerian pepper soup with fresh catfish', '/api/placeholder/400/300', 420, 32.4, 8.2, 15.6, 'high-protein'),
('Beans and Plantain Porridge', 'Nutritious beans porridge with sweet plantain', '/api/placeholder/400/300', 480, 18.3, 68.5, 12.7, 'vegan'),
('Suya with Mixed Vegetables', 'Grilled suya beef with fresh mixed vegetables', '/api/placeholder/400/300', 520, 38.2, 25.1, 22.8, 'high-protein'),
('Vegetable Soup with Rice', 'Fresh Nigerian vegetable soup with white rice', '/api/placeholder/400/300', 390, 12.5, 55.3, 8.9, 'vegan');

-- Insert sample discount coupons
INSERT INTO public.discount_coupons (code, discount_type, discount_value, min_order_amount, max_uses, is_active, expires_at) VALUES
('WELCOME20', 'percentage', 20, 5000, 100, true, now() + interval '30 days'),
('FIRSTORDER', 'fixed_amount', 1000, 3000, 500, true, now() + interval '60 days'),
('FRIEND500', 'fixed_amount', 500, 2000, 1000, true, now() + interval '90 days');