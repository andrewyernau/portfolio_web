#!/bin/sh
set -eu
umask 077

if [ -z "${PGHOST:-}" ] || [ -z "${PGDATABASE:-}" ] || [ -z "${PGUSER:-}" ]; then
  echo "PGHOST, PGDATABASE, and PGUSER are required" >&2
  exit 1
fi

backup_dir="${BACKUP_DIR:-/backups}"
retention_days="${BACKUP_RETENTION_DAYS:-14}"

case "$backup_dir" in
  ""|/) echo "Refusing unsafe BACKUP_DIR" >&2; exit 1 ;;
esac
case "$retention_days" in
  *[!0-9]*|"") echo "BACKUP_RETENTION_DAYS must be a non-negative integer" >&2; exit 1 ;;
esac

mkdir -p "$backup_dir"
lock_dir="$backup_dir/.backup.lock"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "A backup is already running" >&2
  exit 1
fi

partial=""
checksum_partial=""
cleanup() {
  [ -z "$partial" ] || rm -f "$partial"
  [ -z "$checksum_partial" ] || rm -f "$checksum_partial"
  rmdir "$lock_dir" 2>/dev/null || true
}
trap cleanup EXIT HUP INT TERM

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
filename="${PGDATABASE}_${timestamp}.dump"
archive="$backup_dir/$filename"
partial="$archive.partial"
checksum="$archive.sha256"
checksum_partial="$checksum.partial"

pg_dump \
  --format=custom \
  --compress=6 \
  --no-owner \
  --no-privileges \
  --file="$partial" \
  "$PGDATABASE"

if [ ! -s "$partial" ]; then
  echo "pg_dump produced an empty archive" >&2
  exit 1
fi

digest="$(sha256sum "$partial" | awk '{print $1}')"
printf '%s  %s\n' "$digest" "$filename" > "$checksum_partial"
mv "$partial" "$archive"
partial=""
mv "$checksum_partial" "$checksum"
checksum_partial=""

find "$backup_dir" -maxdepth 1 -type f \
  \( -name '*.dump' -o -name '*.dump.sha256' \) \
  -mtime "+$retention_days" -delete

echo "Backup completed: $filename"
