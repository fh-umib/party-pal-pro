
-- Fix overly permissive INSERT policies on booking junction tables
-- Replace WITH CHECK (true) with proper validation

DROP POLICY "Insert booking_mascots" ON public.booking_mascots;
DROP POLICY "Insert booking_activities" ON public.booking_activities;
DROP POLICY "Insert booking_extras" ON public.booking_extras;
DROP POLICY "Insert booking_decorations" ON public.booking_decorations;
DROP POLICY "Insert booking_furniture" ON public.booking_furniture;

-- Only allow inserting if the booking belongs to the current user or is a guest booking
CREATE POLICY "Insert booking_mascots" ON public.booking_mascots FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR b.is_guest = true))
);

CREATE POLICY "Insert booking_activities" ON public.booking_activities FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR b.is_guest = true))
);

CREATE POLICY "Insert booking_extras" ON public.booking_extras FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR b.is_guest = true))
);

CREATE POLICY "Insert booking_decorations" ON public.booking_decorations FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR b.is_guest = true))
);

CREATE POLICY "Insert booking_furniture" ON public.booking_furniture FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND (b.user_id = auth.uid() OR b.is_guest = true))
);
