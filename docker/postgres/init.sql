-- Run once on first container start
SELECT 'CREATE DATABASE cnd_upraze'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'cnd_upraze'
)\gexec

GRANT ALL PRIVILEGES ON DATABASE cnd_upraze TO cnd_user;
