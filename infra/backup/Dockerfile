ARG POSTGRES_IMAGE=postgres:17-alpine
FROM ${POSTGRES_IMAGE}

COPY --chmod=0555 scripts /opt/backup
COPY crontab /etc/crontabs/root

ENV BACKUP_DIR=/backups \
    BACKUP_RETENTION_DAYS=14 \
    PGCONNECT_TIMEOUT=10

VOLUME ["/backups"]
ENTRYPOINT ["/opt/backup/entrypoint.sh"]
CMD ["crond", "-f", "-l", "8"]
