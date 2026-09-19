#!/bin/bash
set -euo pipefail

# Production release safety boundary. This helper owns the branch/tag checks
# and publisher dispatch so its fail-closed behavior can be exercised against
# disposable Git remotes in the workflow contract tests.
: "${TAG:?TAG is required}"
: "${DID_BUMP:?DID_BUMP is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"
: "${RELEASE_BRANCH:?RELEASE_BRANCH is required}"

remote=${RELEASE_REMOTE:-origin}
remote_tag_sha=$(git ls-remote --tags "$remote" "refs/tags/$TAG" | grep -v '{}$' | awk '{print $1}' || true)
peeled_sha=$(git ls-remote --tags "$remote" "refs/tags/$TAG^{}" | awk '{print $1}' || true)
if [[ -n "$peeled_sha" ]]; then
  remote_tag_sha="$peeled_sha"
fi

if [[ "$DID_BUMP" == "false" ]]; then
  if [[ -n "$remote_tag_sha" && "$remote_tag_sha" != "$GITHUB_SHA" ]]; then
    echo "Error: Tag $TAG already exists on $remote but points to $remote_tag_sha, not expected $GITHUB_SHA." >&2
    exit 1
  fi
  new_sha="$GITHUB_SHA"
else
  if [[ -n "$remote_tag_sha" ]]; then
    echo "Error: Tag $TAG already exists on $remote, but a version bump was prepared. Cannot move tag." >&2
    exit 1
  fi

  current_remote_sha=$(git ls-remote "$remote" "refs/heads/$RELEASE_BRANCH" | awk '{print $1}')
  if [[ "$current_remote_sha" != "$GITHUB_SHA" ]]; then
    echo "Error: Remote branch $RELEASE_BRANCH has moved to $current_remote_sha. Expected $GITHUB_SHA." >&2
    exit 1
  fi

  git push "$remote" "HEAD:refs/heads/$RELEASE_BRANCH"
  new_sha=$(git rev-parse HEAD)

  verify_branch_sha=$(git ls-remote "$remote" "refs/heads/$RELEASE_BRANCH" | awk '{print $1}')
  if [[ "$verify_branch_sha" != "$new_sha" ]]; then
    echo "Error: Remote branch is at $verify_branch_sha but expected $new_sha. Failing closed." >&2
    exit 1
  fi
fi

if [[ -z "$remote_tag_sha" ]]; then
  git tag "$TAG" "$new_sha"
  if ! git push "$remote" "refs/tags/$TAG"; then
    remote_tag_sha=$(git ls-remote --tags "$remote" "refs/tags/$TAG" | awk '{print $1}')
    if [[ "$remote_tag_sha" != "$new_sha" ]]; then
      echo "Error: Tag push raced with a different SHA ($remote_tag_sha)." >&2
      exit 1
    fi
  fi
fi

gh workflow run ci.yml --ref "$TAG" -f mode=publish-tag
