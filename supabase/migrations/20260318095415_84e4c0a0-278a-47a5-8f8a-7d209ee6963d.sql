
-- =============================================
-- MD CREATIVE EVENT BOOKING SYSTEM - FULL SCHEMA
-- =============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE public.event_type AS ENUM ('wedding', 'engagement', 'birthday', 'anniversary', 'grand_opening', 'corporate', 'other');
CREATE TYPE public.decoration_theme AS ENUM (
  'elegant', 'classic', 'luxury',
  'romantic', 'modern', 'minimal',
  'princess', 'barbie', 'frozen', 'pink',
  'spiderman', 'superheroes', 'cars', 'blue',
  'custom'
);

-- 2. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. USER ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- 4. SECURITY DEFINER FUNCTION FOR ROLE CHECKS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. PACKAGES TABLE
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_mascots INT NOT NULL DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  includes_addons TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. MASCOTS TABLE
CREATE TABLE public.mascots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  character TEXT,
  description TEXT,
  category TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ACTIVITIES TABLE
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_exclusive BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. EXTRAS TABLE
CREATE TABLE public.extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. DECORATION CATEGORIES TABLE
CREATE TABLE public.decoration_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  event_type event_type,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. DECORATION THEMES TABLE
CREATE TABLE public.decoration_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.decoration_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  theme decoration_theme,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. EVENT FURNITURE TABLE
CREATE TABLE public.event_furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  cover_color TEXT,
  image_url TEXT,
  quantity_available INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. INVENTORY TABLE
CREATE TABLE public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity_total INT NOT NULL DEFAULT 0,
  quantity_available INT NOT NULL DEFAULT 0,
  condition TEXT DEFAULT 'good',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. BOOKINGS TABLE
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type event_type DEFAULT 'other',
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT NOT NULL,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  total_price NUMERIC(10,2) DEFAULT 0,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. BOOKING JUNCTION TABLES
CREATE TABLE public.booking_mascots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  mascot_id UUID REFERENCES public.mascots(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(booking_id, mascot_id)
);

CREATE TABLE public.booking_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(booking_id, activity_id)
);

CREATE TABLE public.booking_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  extra_id UUID REFERENCES public.extras(id) ON DELETE CASCADE NOT NULL,
  quantity INT DEFAULT 1,
  UNIQUE(booking_id, extra_id)
);

CREATE TABLE public.booking_decorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  decoration_theme_id UUID REFERENCES public.decoration_themes(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.booking_furniture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  furniture_id UUID REFERENCES public.event_furniture(id) ON DELETE CASCADE NOT NULL,
  quantity INT DEFAULT 1
);

-- 15. PACKAGE JUNCTION TABLES
CREATE TABLE public.package_mascots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  mascot_id UUID REFERENCES public.mascots(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(package_id, mascot_id)
);

CREATE TABLE public.package_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(package_id, activity_id)
);

-- 16. STAFF ASSIGNMENTS TABLE
CREATE TABLE public.staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  staff_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'general',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  staff_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. LOYALTY TABLE
CREATE TABLE public.loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_bookings INT DEFAULT 0,
  loyalty_points INT DEFAULT 0,
  discount_eligible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. EVENT GALLERY TABLE
CREATE TABLE public.event_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  event_type event_type,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. PHOTO SERVICES TABLE
CREATE TABLE public.photo_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mascots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_mascots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_furniture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_mascots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_services ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Public catalog tables
CREATE POLICY "Anyone can view packages" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage packages" ON public.packages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view mascots" ON public.mascots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage mascots" ON public.mascots FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view activities" ON public.activities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage activities" ON public.activities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view extras" ON public.extras FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage extras" ON public.extras FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view decoration_categories" ON public.decoration_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage decoration_categories" ON public.decoration_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view decoration_themes" ON public.decoration_themes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage decoration_themes" ON public.decoration_themes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view event_furniture" ON public.event_furniture FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage event_furniture" ON public.event_furniture FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view photo_services" ON public.photo_services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage photo_services" ON public.photo_services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view event_gallery" ON public.event_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage event_gallery" ON public.event_gallery FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Authenticated users can create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Guest users can create bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (is_guest = true);
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Booking junction tables
CREATE POLICY "View own booking_mascots" ON public.booking_mascots FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert booking_mascots" ON public.booking_mascots FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage booking_mascots" ON public.booking_mascots FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "View own booking_activities" ON public.booking_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert booking_activities" ON public.booking_activities FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage booking_activities" ON public.booking_activities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "View own booking_extras" ON public.booking_extras FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert booking_extras" ON public.booking_extras FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage booking_extras" ON public.booking_extras FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "View own booking_decorations" ON public.booking_decorations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert booking_decorations" ON public.booking_decorations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage booking_decorations" ON public.booking_decorations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "View own booking_furniture" ON public.booking_furniture FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Insert booking_furniture" ON public.booking_furniture FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage booking_furniture" ON public.booking_furniture FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Package junction tables
CREATE POLICY "Anyone can view package_mascots" ON public.package_mascots FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage package_mascots" ON public.package_mascots FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view package_activities" ON public.package_activities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage package_activities" ON public.package_activities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Inventory
CREATE POLICY "Staff can view inventory" ON public.inventory_items FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins can manage inventory" ON public.inventory_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Staff assignments
CREATE POLICY "Staff can view assignments" ON public.staff_assignments FOR SELECT USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff') OR staff_user_id = auth.uid()
);
CREATE POLICY "Admins can manage assignments" ON public.staff_assignments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE POLICY "Anyone can view visible reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admins can view all reviews" ON public.reviews FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Loyalty
CREATE POLICY "Users can view own loyalty" ON public.loyalty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all loyalty" ON public.loyalty FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage loyalty" ON public.loyalty FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mascots_updated_at BEFORE UPDATE ON public.mascots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_extras_updated_at BEFORE UPDATE ON public.extras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_loyalty_updated_at BEFORE UPDATE ON public.loyalty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + role + loyalty on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  INSERT INTO public.loyalty (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-hide low-quality reviews
CREATE OR REPLACE FUNCTION public.auto_moderate_review()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating = 1 AND (NEW.comment IS NULL OR LENGTH(TRIM(NEW.comment)) < 10) THEN
    NEW.is_visible = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER auto_moderate_review_trigger
BEFORE INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.auto_moderate_review();

-- Update loyalty on booking completion
CREATE OR REPLACE FUNCTION public.update_loyalty_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.user_id IS NOT NULL THEN
    UPDATE public.loyalty
    SET total_bookings = total_bookings + 1,
        loyalty_points = loyalty_points + 10,
        discount_eligible = (total_bookings + 1) >= 3
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_loyalty_trigger
AFTER UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_loyalty_on_booking();

-- Notification on booking status change
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, booking_id, type, title, message)
    VALUES (
      NEW.user_id, NEW.id, 'booking_status',
      'Booking ' || INITCAP(NEW.status::text),
      'Your booking for ' || NEW.event_date::text || ' has been ' || NEW.status::text || '.'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER notify_booking_status_trigger
AFTER UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_booking_status_change();

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_mascots_category ON public.mascots(category);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_staff_assignments_booking ON public.staff_assignments(booking_id);
CREATE INDEX idx_decoration_themes_category ON public.decoration_themes(category_id);
