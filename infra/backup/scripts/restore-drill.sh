#!/bin/sh
set -eu

if [ "${ALLOW_RESTORE_DRILL:-false}" != "true" ]; then
  echo "Set ALLOW_RESTORE_DRILL=true for an explicitly disposable target" >&2
  exit 1
fi

if [ -z "${PGHOST:-}" ] || [ -z "${PGUSER:-}" ] || [ -z "${RESTORE_DATABASE:-}" ]; then
  echo "PGHOST, PGUSER, and RESTORE_DATABASE are required" >&2
  exit 1
fi

case "$RESTORE_DATABASE" in
  *_restore) ;;
  *) echo "RESTORE_DATABASE must end in _restore" >&2; exit 1 ;;
esac

if [ "${PGDATABASE:-}" = "$RESTORE_DATABASE" ]; then
  echo "Source and restore database names must differ" >&2
  exit 1
fi

backup_dir="${BACKUP_DIR:-/backups}"
archive="${BACKUP_FILE:-}"
if [ -z "$archive" ]; then
  archive="$(find "$backup_dir" -maxdepth 1 -type f -name '*.dump' | sort | tail -n 1)"
fi
if [ -z "$archive" ] || [ ! -f "$archive" ]; then
  echo "No backup archive found" >&2
  exit 1
fi
if [ ! -f "$archive.sha256" ]; then
  echo "Missing checksum for $archive" >&2
  exit 1
fi

(cd "$(dirname "$archive")" && sha256sum -c "$(basename "$archive").sha256")
pg_restore --list "$archive" >/dev/null

dropdb --if-exists "$RESTORE_DATABASE"
createdb "$RESTORE_DATABASE"

restore_ok=false
cleanup() {
  if [ "$restore_ok" != true ] || [ "${KEEP_RESTORE_DATABASE:-false}" != "true" ]; then
    dropdb --if-exists "$RESTORE_DATABASE" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT HUP INT TERM

pg_restore \
  --exit-on-error \
  --no-owner \
  --no-privileges \
  --dbname="$RESTORE_DATABASE" \
  "$archive"

table_count="$(psql --dbname="$RESTORE_DATABASE" --tuples-only --no-align --command \
  "SELECT count(*) FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');")"
case "$table_count" in
  ''|*[!0-9]*) echo "Could not verify restored tables" >&2; exit 1 ;;
  0) echo "Restore contains no application tables" >&2; exit 1 ;;
esac

restore_ok=true
echo "Restore drill completed: $table_count application tables restored from $(basename "$archive")"
