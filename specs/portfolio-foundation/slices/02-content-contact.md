# Slice 02 — Content and reliable contact

Unlock database-backed bilingual site content and a contact flow that cannot silently lose accepted messages. `POST /api/v1/contact` validates input, uses a honeypot and bounded rate limit, writes the message plus outbox row transactionally, and returns `202`. A worker retries SMTP with bounded backoff; sender identity is configured and visitor email is only `Reply-To`.

Verify validation and error envelopes, transaction rollback, duplicate-worker locking, retry after SMTP failure, Mailpit delivery, no PII in logs/metrics, and frontend success/error states. The SMTP adapter is the seam; no route imports a concrete transport.

