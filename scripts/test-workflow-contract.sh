#!/bin/bash
set -euo pipefail

echo "Running CI workflow contract tests..."
root=$(cd "$(dirname "$0")/.." && pwd)
workflow="$root/.github/workflows/ci.yml"
route="$root/scripts/ci-route-logic.sh"
policy="$root/scripts/release-policy.sh"

fail() { echo "FAIL: $*" >&2; exit 1; }
require() { grep -Fq -- "$1" "$workflow" || fail "workflow is missing: $1"; }
forbid() { ! grep -Eq -- "$1" "$workflow" || fail "workflow contains forbidden recovery command: $1"; }

route_case() {
  local name=$1 event=$2 mode=$3 type=$4 ref=$5 expected=$6 expected_publisher=${7:-}
  local output actual_publisher
  output=$(mktemp)
  if EVENT_NAME="$event" INPUT_MODE="$mode" REF_TYPE="$type" GITHUB_REF="$ref" EVENT_ACTION='' EVENT_SCHEDULE='' GITHUB_OUTPUT="$output" "$route" >/dev/null 2>&1; then
    status=0
  else
    status=$?
  fi
  if [[ "$status" != "$expected" ]]; then
    rm -f "$output"
    fail "$name expected exit $expected, got $status"
  fi
  if [[ "$status" == 0 && -n "$expected_publisher" ]]; then
    actual_publisher=$(sed -n 's/^run_publisher=//p' "$output")
    [[ "$actual_publisher" == "$expected_publisher" ]] || fail "$name expected publisher=$expected_publisher, got $actual_publisher"
  fi
  rm -f "$output"
}

policy_case() {
  local name=$1 tag=$2 version=$3 expected=$4
  local output status
  output=$(mktemp)
  if "$policy" "$tag" "$version" >"$output" 2>/dev/null; then status=0; else status=$?; fi
  if [[ "$status" != "$expected" ]]; then cat "$output"; rm -f "$output"; fail "$name expected exit $expected, got $status"; fi
  if [[ "$status" == 0 ]]; then cat "$output"; fi
  rm -f "$output"
}

# Event routing: no ordinary event, including a pushed tag, can become a
# publisher. Only the explicit tag-context publisher dispatch can do that.
route_case 'PR cannot publish' pull_request '' branch refs/heads/main 0 false
route_case 'branch push cannot publish' push '' branch refs/heads/main 0 false
route_case 'tag push cannot publish' push '' tag refs/tags/v1.2.3 0 false
route_case 'build dispatch cannot publish' workflow_dispatch build branch refs/heads/main 0 false
route_case 'release requires main/master' workflow_dispatch release-patch branch refs/heads/release 1
route_case 'release requires a branch' workflow_dispatch release-patch tag refs/tags/v1.2.3 1
route_case 'publish requires a semver tag' workflow_dispatch publish-tag tag refs/tags/v1.2 1
route_case 'publish rejects a branch' workflow_dispatch publish-tag branch refs/heads/main 1
route_case 'publish accepts a release tag' workflow_dispatch publish-tag tag refs/tags/v1.2.3 0 true

# This production helper is used immediately before publisher side effects.
policy_case 'stable policy' v1.2.3 1.2.3 0 | grep -Fxq 'publish_npm=true' || fail 'stable must publish'
policy_case 'stable policy' v1.2.3 1.2.3 0 | grep -Fxq 'npm_dist_tag=latest' || fail 'stable must use latest'
policy_case 'stable policy' v1.2.3 1.2.3 0 | grep -Fxq 'prepare_next=true' || fail 'stable must prepare next'
policy_case 'RC policy' v1.2.3-rc 1.2.3-rc 0 | grep -Fxq 'npm_dist_tag=next' || fail 'RC must use next'
policy_case 'alpha policy' v1.2.3-alpha 1.2.3-alpha 0 | grep -Fxq 'prerelease=true' || fail 'alpha must be a prerelease'
policy_case 'test policy' v1.2.3-test 1.2.3-test 0 | grep -Fxq 'publish_npm=true' || fail 'test must publish'
policy_case 'bare next policy' v1.2.3-next 1.2.3-next 0 | grep -Fxq 'publish_npm=false' || fail 'bare -next must not publish'
policy_case 'bare next policy' v1.2.3-next 1.2.3-next 0 | grep -Fxq 'prerelease=true' || fail 'bare -next must create a prerelease'
policy_case 'tag/version mismatch' v1.2.3 1.2.4 1
policy_case 'invalid tag' v1.2 1.2 1

# Inspect the real workflow for the release-state safeguards that cannot be
# safely executed in tests: this suite never invokes git push, npm publish or
# a GitHub Release action.
require 'go run github.com/rhysd/actionlint/cmd/actionlint@latest'
require 'if [[ "$CURRENT_REMOTE_SHA" != "$VALIDATED_SHA" ]]'
require 'if [[ "$VERIFY_BRANCH_SHA" != "$NEW_SHA" ]]'
require 'Tag $TAG already exists on origin, but we just bumped the version locally. Cannot move tag.'
require 'gh workflow run ci.yml --ref "$TAG" -f mode=publish-tag'
require './scripts/release-policy.sh "$TAG_NAME" "$CURRENT_VERSION" >> "$GITHUB_OUTPUT"'
require 'uses: softprops/action-gh-release@v2'
require 'npm publish --access=public --tag ${{ steps.policy.outputs.npm_dist_tag }}'
require 'needs: [route, node-lint-test, workflow-validation, build]'
[[ $(grep -Fc 'uses: softprops/action-gh-release@v2' "$workflow") == 1 ]] || fail 'only publisher may create GitHub Releases'
[[ $(grep -Fc 'npm publish --access=public' "$workflow") == 1 ]] || fail 'only publisher may publish npm'
forbid 'git[[:space:]]+(pull|rebase|merge|reset)'
forbid 'git[[:space:]]+push[^\n]*(--force|-f[[:space:]])'
if grep -Eq '^  release:' "$workflow"; then fail 'release: published must not route into this workflow'; fi

echo "All CI workflow contract tests passed."
