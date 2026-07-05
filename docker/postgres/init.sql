-- ============================================================
-- EAM/AIM/RCM Platform — Database Initialization
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create application schema
CREATE SCHEMA IF NOT EXISTS eam;

-- Set default search path
ALTER DATABASE eam_platform SET search_path TO eam, public;

-- Create read-only analytics role
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'eam_readonly') THEN
        CREATE ROLE eam_readonly;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'eam_app') THEN
        CREATE ROLE eam_app;
    END IF;
END
$$;

-- Grant schema usage
GRANT USAGE ON SCHEMA eam TO eam_app;
GRANT USAGE ON SCHEMA eam TO eam_readonly;
GRANT ALL ON SCHEMA eam TO eam_user;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA eam GRANT SELECT ON TABLES TO eam_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA eam GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO eam_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA eam GRANT USAGE, SELECT ON SEQUENCES TO eam_app;

-- Enable Row Level Security helper function
CREATE OR REPLACE FUNCTION eam.current_tenant_id()
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Audit trigger function
CREATE OR REPLACE FUNCTION eam.audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

SELECT 'Database initialized successfully' AS status;
