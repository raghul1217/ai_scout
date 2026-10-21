#!/bin/sh
set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/aiscout_db_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating database backup to $FILENAME..."
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump -h postgres -U "${POSTGRES_USER}" "${POSTGRES_DB}" | gzip > "$FILENAME"

echo "Database backup completed successfully."

# Prune backups older than 14 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -exec rm {} \;
echo "Pruned backups older than 14 days."
