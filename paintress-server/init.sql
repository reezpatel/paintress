-- Paintress Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create additional databases if needed
-- (Main database is created by POSTGRES_DB environment variable)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE paintress_db TO paintress_user;

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS paintress_schema;

-- Set search path
-- ALTER DATABASE paintress_db SET search_path TO paintress_schema, public;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Paintress database initialized successfully';
END $$; 