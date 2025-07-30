-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Library table
CREATE TABLE IF NOT EXISTS "Library" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    searchInput TEXT NOT NULL,
    userEmail TEXT NOT NULL,
    type TEXT NOT NULL,
    searchId TEXT,
    searchResults JSONB,
    aiModel TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_library_user_email ON "Library"(userEmail);
CREATE INDEX IF NOT EXISTS idx_library_type ON "Library"(type);
CREATE INDEX IF NOT EXISTS idx_library_search_id ON "Library"(searchId);
CREATE INDEX IF NOT EXISTS idx_library_search_results ON "Library" USING GIN (searchResults);
CREATE INDEX IF NOT EXISTS idx_library_ai_model ON "Library"(aiModel);

-- Enable Row Level Security (RLS)
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Library" ENABLE ROW LEVEL SECURITY;

-- Create policies for Users table
CREATE POLICY "Allow all insert for Users" ON "Users"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all select for Users" ON "Users"
    FOR SELECT USING (true);

CREATE POLICY "Allow update own user" ON "Users"
    FOR UPDATE USING (true);

-- Create policies for Library table
CREATE POLICY "Allow all insert for Library" ON "Library"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all select for Library" ON "Library"
    FOR SELECT USING (true);

CREATE POLICY "Allow update own library entries" ON "Library"
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_updated_at BEFORE UPDATE ON "Library"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 