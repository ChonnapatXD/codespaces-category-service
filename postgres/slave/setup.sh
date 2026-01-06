#!/bin/bash
set -e

echo "⏳ Waiting for master..."
until pg_isready -h postgres-master -p 5432 -U replicator; do
  sleep 2
done

if [ ! -f "/var/lib/postgresql/data/standby.signal" ]; then
  echo "🧹 Initializing standby..."

  rm -rf /var/lib/postgresql/data/*

  PGPASSWORD=replpassword pg_basebackup \
    -h postgres-master \
    -D /var/lib/postgresql/data \
    -U replicator \
    -Fp -Xs -P -R
else
  echo "✅ Standby already initialized"
fi

echo "🚀 Starting postgres (standby mode)"
exec docker-entrypoint.sh postgres
