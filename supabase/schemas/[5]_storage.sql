-- CREATING THE TABLS
INSERT INTO storage.buckets
        (id, name, public)
    VALUES
        ('images', 'images', true);

-- Access
CREATE POLICY "Allow users to upload images"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'images'
)

-- Missing!
--  - More robust RLS: only group leaders / admins should be able to upload group images / logos etc
--  - Only image MIMEtypeas
--  - fileSize shouldn't be unlimited    