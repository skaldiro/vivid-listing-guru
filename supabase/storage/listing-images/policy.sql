-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name)
VALUES ('listing-images', 'listing-images');

-- Set up storage policies
CREATE POLICY "Users can view own listing images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'listing-images' AND (storage.foldername(name))[1] IN (
  SELECT id::text FROM listings WHERE user_id = auth.uid()
));

CREATE POLICY "Users can upload own listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images' AND (storage.foldername(name))[1] IN (
  SELECT id::text FROM listings WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND (storage.foldername(name))[1] IN (
  SELECT id::text FROM listings WHERE user_id = auth.uid()
));