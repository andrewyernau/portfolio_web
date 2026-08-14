# Repository policy

Protect `main` from direct pushes and require the `CI` quality, configuration,
and integration jobs plus all `Security` jobs. Require one approving review,
conversation resolution, linear history, and dismissal of stale approvals.
Apply these controls with a GitHub ruleset after the repository owner and plan
are known; a checked-in document cannot enforce server-side protection.

Grant workflow tokens read-only permissions by default. The release workflow is
the sole exception for package publication and provenance. Configure a protected
GitHub environment only when a real deployment adapter exists. Production
secrets belong in that environment or an external secret manager, never Actions
variables, workflow YAML, images, artifacts, or logs.

Dependabot owns routine dependency and action updates. Review lockfile changes,
base-image provenance, release notes, and the full CI result before merging.
Release artifacts are addressed by digest; mutable tags are navigation aids,
not deployment identity.

CODEOWNERS is intentionally deferred until a real GitHub account or team is
known. Adding a fictitious owner would make the policy misleading and invalid.
