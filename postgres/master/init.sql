-- =========================
-- 1) Create database safely
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydatabase') THEN
    CREATE DATABASE mydatabase;
  END IF;
END$$;

\c mydatabase;

-- =========================
-- 2) Create enum & table
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category') THEN
    CREATE TYPE category AS ENUM ('main', 'snack', 'drink');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price INT NOT NULL,
  image TEXT NOT NULL,
  category category NOT NULL
);

-- =========================
-- 3) Create replication user (ONCE)
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'replicator') THEN
    CREATE ROLE replicator
      WITH REPLICATION
      LOGIN
      PASSWORD 'replpassword';
  END IF;
END$$;
