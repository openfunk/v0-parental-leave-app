-- Create leaving_house_items table for customizable leaving house checklist
CREATE TABLE IF NOT EXISTS leaving_house_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  duration TEXT NOT NULL CHECK (duration IN ('quick', 'half-day', 'full-day', 'overnight')),
  item_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leaving_house_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own leaving house items"
  ON leaving_house_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leaving house items"
  ON leaving_house_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaving house items"
  ON leaving_house_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leaving house items"
  ON leaving_house_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS leaving_house_items_user_id_idx ON leaving_house_items(user_id);
CREATE INDEX IF NOT EXISTS leaving_house_items_duration_idx ON leaving_house_items(duration);

-- Insert default items for new users (this will be done via the app on first load)
