# Slice 03 — Privacy-preserving analytics

Unlock coarse page-view and daily-unique signals. The browser sends only normalized path and locale. The API derives server time, broad client family, optional trusted country code, and a daily HMAC of a truncated IP prefix. DNT and Global Privacy Control opt out.

Verify IPv4/IPv6 truncation, daily rotation, forwarded-header trust, bounded path/locale values, UA family fixtures, opt-out headers, and retention deletion. Raw IP, raw UA, referrer path, query string, email, and persistent fingerprint must never reach storage, logs, or metrics.

