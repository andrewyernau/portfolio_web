# Slice 05 — CI, release hardening, and visual gate

Unlock CI for install, lint/typecheck/test/build, migration checks, configuration validation, container builds, dependency review, and immutable release images. Deployment stops at GHCR until a provider, domain, TLS boundary, and environment protection rules are chosen.

Verify that only Nginx is publicly exposed, bodies and request rates are bounded, unsafe defaults fail in production, secrets are absent from images/logs, and `/metrics` is not routed publicly. Capture desktop/mobile final screenshots and run `screenshot-critique` unprimed as the final visual gate. The human checkpoint is non-blocking and follows the same short review window as slice 01.
