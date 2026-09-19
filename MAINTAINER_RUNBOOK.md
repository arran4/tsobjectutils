# Maintainer Runbook: Releases and Recovery

This runbook describes the release contract implemented by
`.github/workflows/ci.yml`. It applies to the public
`@arran4/tsobjectutils` package and does not require access to private
repositories.

## Release policy

Start a normal release with **Actions → CI/CD → Run workflow**, choose `main`
(or `master` where that is the maintained default branch), and select the
requested `release-*` mode. The route and preparation jobs fail before a
mutation when the dispatch is not a branch context on `main` or `master`.

`git-tag-inc` selects versions for normal modes. A manually supplied
`release_version_override` takes precedence; it accepts `X.Y.Z` or `vX.Y.Z`
and may include one dot-separated prerelease suffix. It is intended for an
already selected exact version, not for choosing a new automatic increment.

| Mode or channel              | Valid starting context                                               | Version selection and tag                                         | GitHub Release              | npm publication             | Prepare-next PR             |
| ---------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------- | --------------------------- | --------------------------- |
| `release-major`              | Manual dispatch on `main`/`master`                                   | Next major, `vX.0.0`                                              | Stable                      | Yes, `latest`               | Yes: next patch `-next`     |
| `release-minor`              | Manual dispatch on `main`/`master`                                   | Next minor, `vX.Y.0`                                              | Stable                      | Yes, `latest`               | Yes: next patch `-next`     |
| `release-patch`              | Manual dispatch on `main`/`master`                                   | Next patch, `vX.Y.Z`                                              | Stable                      | Yes, `latest`               | Yes: next patch `-next`     |
| `release-rc`                 | Manual dispatch on `main`/`master`                                   | Next patch RC, `vX.Y.Z-rc`                                        | Prerelease                  | Yes, `next`                 | No                          |
| `release-alpha`              | Manual dispatch on `main`/`master`                                   | Next patch alpha, `vX.Y.Z-alpha`                                  | Prerelease                  | Yes, `next`                 | No                          |
| `release-test`               | Manual dispatch on `main`/`master`                                   | Next patch test prerelease, `vX.Y.Z-test`                         | Prerelease                  | Yes, `next`                 | No                          |
| Ordinary development `-next` | Produced by a stable release's prepare-next PR; a tag is exceptional | `vX.Y.Z-next`                                                     | Prerelease                  | No; `none`                  | No                          |
| Internal `publish-tag`       | Explicit dispatch at an eligible existing `vX.Y.Z[-suffix]` tag      | No version calculation; tag must equal `v${package.json.version}` | Uses the tag's policy above | Uses the tag's policy above | Uses the tag's policy above |

The explicit policy for a bare `-next` development tag is preserved: it creates
a visible GitHub prerelease but is deliberately not published to npm. RC,
alpha, and test prereleases are published with npm's `next` dist-tag. The
workflow contract tests exercise these cases through the same
`scripts/release-policy.sh` code used by the publisher.

## What happens during a normal release

The preparation job validates that the checked-out dispatch SHA is still the
remote `main`/`master` SHA, calculates the version, and commits a version bump
only when needed. Before pushing that bump it checks the remote branch again;
after the push it requires the observed remote branch SHA to equal the newly
pushed bump commit. It then creates a tag only if that tag is absent. A tag
already pointing somewhere else fails; existing tags are never moved.

The preparation job explicitly dispatches `publish-tag` against the immutable
tag. This is the publisher path. Do not expect a tag created with the normal
`GITHUB_TOKEN` to start another workflow run: GitHub suppresses recursive
workflow events created with that token. A normal tag push also does not route
to publication in this workflow.

The publisher validates the package version against the tag before it creates
the GitHub Release or invokes npm. The `publisher` job is the only workflow job
that contains GitHub Release creation or `npm publish`.

## Exact-version recovery

For a failure after the intended version is known, use **Run workflow** at
`main` or `master` with the original `release-*` mode and set
`release_version_override` to the exact target, for example `1.4.0` or
`v1.4.0-rc`. Do not rerun an automatic increment mode without the override.

The current safeguards fail closed when the dispatch is a tag or wrong branch,
the branch moved after validation, the remote branch is not the bump SHA after
push, the existing tag resolves to a different SHA, or the tag and
`package.json` version disagree. Do not pull, rebase, merge, reset, or
force-push to recover a release state; those paths are intentionally absent
from the workflow.

If the bump landed but the tag did not, first inspect the exact branch commit
and tag state. An exact override can reuse a matching package version, but
fully state-aware recovery is not yet complete. If the tag exists but the
publisher failed, select that exact tag in the Actions UI and dispatch
`publish-tag`; it will rerun the tag/version check and channel policy.

## Current limitations and follow-up work

This workflow does **not** yet guarantee a fully idempotent recovery at every
partial state. It also rebuilds during publication rather than proving it
publishes the byte-for-byte tarball validated earlier. Those gaps are tracked
separately and are not claims of this runbook:

- #54: state-aware, idempotent recovery after every partial release state;
- #55: publication of the exact validated npm tarball;
- #58: post-publication verification that does not rely on a
  `release: published` event.

## Local verification

Run the repository checks before changing release automation:

```bash
npm ci
npx prettier . --check
npm run lint
npm test
npm run build
./scripts/consumer-smoke-test.sh
go run github.com/rhysd/actionlint/cmd/actionlint@latest
```

`npm test` includes routing and workflow-contract tests. They use invalid
fixtures and static checks of the production workflow but never push a tag,
publish npm, or create a GitHub Release. CI runs the same contract tests and a
separate actionlint job.
