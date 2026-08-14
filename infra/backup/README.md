# PostgreSQL backup and restore drill

The backup container runs daily at 02:30 UTC. It writes a PostgreSQL custom
archive to a temporary name, verifies it is non-empty, publishes it, adds a
SHA-256 sidecar, and deletes expired archives. A named local volume is useful
for development only; production must copy backups to encrypted off-host
storage with independently managed access and lifecycle rules.

Required connection variables are `PGHOST`, `PGDATABASE`, and `PGUSER`.
Provide authentication using `POSTGRES_PASSWORD_FILE` mounted from a secret;
the entrypoint exports it only inside the container. Retention defaults to 14
days. The schedule defaults to the checked-in 02:30 UTC contract and accepts a
five-field `BACKUP_SCHEDULE`; unsupported shell characters fail closed.

A backup is not accepted until restored into a disposable PostgreSQL instance:

```sh
docker compose run --rm \
  -e ALLOW_RESTORE_DRILL=true \
  -e PGHOST=restore-postgres \
  -e PGUSER=postgres \
  -e RESTORE_DATABASE=portfolio_restore \
  backup /opt/backup/restore-drill.sh
```

The drill verifies the checksum and archive catalog, recreates only a database
whose name ends in `_restore`, restores with fail-fast semantics, and requires
at least one application table. It drops the drill database afterward unless
`KEEP_RESTORE_DATABASE=true`. Run it against a separate ephemeral server, never
the production PostgreSQL cluster.

Backups inherit personal data retention concerns. Database row deletion does
not erase existing archives immediately; access must be restricted and backup
lifecycle expiry documented in the privacy notice and incident procedures.
