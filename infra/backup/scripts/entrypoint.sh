#!/bin/sh
set -eu

if [ -n "${POSTGRES_PASSWORD_FILE:-}" ]; then
  if [ ! -r "$POSTGRES_PASSWORD_FILE" ]; then
    echo "POSTGRES_PASSWORD_FILE is not readable" >&2
    exit 1
  fi
  PGPASSWORD="$(cat "$POSTGRES_PASSWORD_FILE")"
  export PGPASSWORD
fi

umask 077
mkdir -p "${BACKUP_DIR:-/backups}"

if [ -n "${BACKUP_SCHEDULE:-}" ]; then
  # Validate in a subshell so the container command in "$@" remains intact.
  if ! (
    # Intentional field splitting for the five cron fields.
    # shellcheck disable=SC2086
    set -- $BACKUP_SCHEDULE
    [ "$#" -eq 5 ] || exit 1
    for field in "$@"; do
      case "$field" in
        *[!0-9*/,-]*) exit 1 ;;
      esac
    done
  ); then
    echo "BACKUP_SCHEDULE must contain five cron fields" >&2
    exit 1
  fi
  printf '%s /opt/backup/backup.sh >>/proc/1/fd/1 2>>/proc/1/fd/2\n' \
    "$BACKUP_SCHEDULE" > /etc/crontabs/root
fi

exec "$@"
