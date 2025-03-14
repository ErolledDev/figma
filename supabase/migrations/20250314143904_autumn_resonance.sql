/*
  # Chat System Schema

  1. New Tables
    - businesses
      - Basic business information and widget settings
    - chat_sessions
      - Tracks chat sessions between visitors and businesses
    - messages
      - Stores all chat messages
    
  2. Security
    - Enable RLS on all tables
    - Add policies for business owners to manage their data
    - Add policies for visitors to participate in chats
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  business_name TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  quick_questions JSONB DEFAULT '[]'::jsonb,
  widget_color TEXT DEFAULT '#33475b',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) NOT NULL,
  visitor_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('business', 'visitor')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Business policies
CREATE POLICY "Business owners can manage their business"
  ON businesses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Chat session policies
CREATE POLICY "Businesses can view their chat sessions"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

CREATE POLICY "Anyone can create chat sessions"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Message policies
CREATE POLICY "Businesses can view their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (session_id IN (
    SELECT id FROM chat_sessions WHERE business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();