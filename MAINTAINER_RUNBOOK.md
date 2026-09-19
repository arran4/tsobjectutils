# Maintainer Runbook: Release & Recovery

This document outlines the expected semantics for releasing `@arran4/tsobjectutils` and how to recover from failure states. It serves as the canonical contract for issues #56, #57, and future automation.

## Release Channel Semantics

Releases are driven by GitHub Actions (`.github/workflows/ci.yml`).

### Standard Flow (Release Preparation -> Publication)

1. **Trigger:** Maintainer dispatches the `CI/CD` workflow on the `main` (or `master`) branch, selecting a mode like `release-minor` or `release-patch`.
2. **Release Preparation (Branch Context):** The `release-ready` and `prepare-release-tag` jobs run. They bump the version in `package.json`, push a fast-forward commit to the branch, and create/push a Git tag (e.g., `v1.2.3`).
3. **Publication (Tag Context):** When the `v1.2.3` tag is pushed to the repository, it triggers the `CI/CD` workflow again in a tag context. The `route` job identifies this external push and triggers the `publisher` job, which actually publishes the tarball to npm.

### Internal Mode: `publish-tag`

- The `publish-tag` mode is intended _only_ as an internal explicit dispatch, or for recovery.
- **Requirement:** It must ONLY run successfully when the workflow runs in a `tag` context where the tag starts with `v` (e.g., `refs/tags/v1.2.3`).
- **Safety Invariant:** You cannot dispatch `publish-tag` from a branch (e.g., `main`). It will fail. This prevents accidental publication of unversioned code.

## Recovery Procedures

Failures can happen during version bumping, tagging, or publishing. Because the release pipeline is idempotent and strict, you must recover using these procedures rather than force-pushing or manual modification.

### Scenario A: Version bumped, but tag push failed

**Symptom:** `package.json` was updated to `v1.2.3` on `main`, but no `v1.2.3` tag exists in GitHub.
**Recovery:** Create the tag manually pointing to the exact bump commit and push it to origin.
This push will automatically trigger the standard tag-based publication flow.

### Scenario B: Tag pushed, but npm publish failed (Partial Publication)

**Symptom:** `v1.2.3` tag exists on GitHub, but the package is not on npm (or the `publisher` job failed).
**Recovery:** Use the `workflow_dispatch` feature in the GitHub Actions UI.

1. Go to Actions -> CI/CD.
2. Click "Run workflow".
3. **CRITICAL:** Select the exact tag (e.g., `v1.2.3`) from the branch/tag dropdown.
4. Set mode to `publish-tag`.
5. Run the workflow. It will re-validate the tag and re-attempt publishing the exact tarball.

### Scenario C: Unrecoverable npm publish failure (e.g., lost exact tarball state)

If npm rejects the publish due to prior partial state and you cannot recover the exact tarball, you must bump the version and perform a new release. Existing tags **cannot be moved**.

1. Dispatch a new `release-patch` (or similar) from `main`.
2. Document the skipped/failed version in the changelog if necessary.

## Safety Invariants Tested in CI

The `.github/workflows/ci.yml` routing logic enforces the following invariants:

- Ordinary PR/push validation cannot publish.
- Release preparation requires the intended branch context.
- `publish-tag` mode requires an eligible `v*` tag context.
- Existing tags cannot be moved (enforced by Git configuration/best practices).
