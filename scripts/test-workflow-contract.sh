#!/bin/bash
set -euo pipefail

echo "Running CI workflow contract tests..."
root=$(cd "$(dirname "$0")/.." && pwd)
workflow="$root/.github/workflows/ci.yml"
route="$root/scripts/ci-route-logic.sh"
policy="$root/scripts/release-policy.sh"
release_helper="$root/scripts/release-tag-and-dispatch.sh"

fail() { echo "FAIL: $*" >&2; exit 1; }
require() { grep -Fq -- "$1" "$workflow" || fail "workflow is missing: $1"; }
contains_forbidden_command() { grep -Eq -- "$1" "$2"; }
forbid() {
  local pattern=$1 file
  shift
  for file in "$@"; do
    ! contains_forbidden_command "$pattern" "$file" || fail "$file contains forbidden recovery command: $pattern"
  done
}

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

# The production tag helper is exercised with disposable local Git remotes and
# a mocked gh command. No test contacts GitHub or npm.
fixture_dirs=()
cleanup_fixtures() {
  local dir
  for dir in "${fixture_dirs[@]}"; do rm -rf "$dir"; done
}
trap cleanup_fixtures EXIT

new_git_fixture() {
  local dir=$1
  git init --bare "$dir/remote.git" >/dev/null
  git init "$dir/work" >/dev/null
  git -C "$dir/work" config user.name workflow-contract-test
  git -C "$dir/work" config user.email workflow-contract-test@example.invalid
  git -C "$dir/work" config commit.gpgsign false
  git -C "$dir/work" config tag.gpgSign false
  printf 'base\n' > "$dir/work/file"
  git -C "$dir/work" add file
  git -C "$dir/work" commit -m base >/dev/null
  git -C "$dir/work" branch -M main
  git -C "$dir/work" remote add origin "$dir/remote.git"
  git -C "$dir/work" push -u origin main >/dev/null
  git -C "$dir/work" rev-parse HEAD
}

make_mock_gh() {
  local dir=$1
  mkdir -p "$dir/bin"
  cat > "$dir/bin/gh" <<'GH'
#!/bin/bash
printf '%s\n' "$*" >> "$GH_LOG"
GH
  chmod +x "$dir/bin/gh"
}

assert_no_tag_or_dispatch() {
  local dir=$1
  if git --git-dir="$dir/remote.git" show-ref --verify --quiet refs/tags/v1.2.3; then
    fail 'failed safety check created a release tag'
  fi
  [[ ! -s "$dir/gh.log" ]] || fail 'failed safety check dispatched publisher'
}

run_release_helper_expect_failure() {
  local dir=$1 validated_sha=$2
  set +e
  (
    cd "$dir/work"
    PATH="$dir/bin:$PATH" GH_LOG="$dir/gh.log" TAG=v1.2.3 DID_BUMP=true GITHUB_SHA="$validated_sha" RELEASE_BRANCH=main "$release_helper"
  ) >/dev/null 2>&1
  local status=$?
  set -e
  [[ "$status" != 0 ]] || fail 'expected release safety helper to fail'
}

# A branch movement after initial validation prevents both the bump push and
# every later side effect.
fixture=$(mktemp -d)
fixture_dirs+=("$fixture")
validated_sha=$(new_git_fixture "$fixture")
git -C "$fixture/work" commit --allow-empty -m bump >/dev/null
git clone -b main "$fixture/remote.git" "$fixture/mover" >/dev/null 2>&1
git -C "$fixture/mover" config user.name workflow-contract-test
git -C "$fixture/mover" config user.email workflow-contract-test@example.invalid
git -C "$fixture/mover" config commit.gpgsign false
git -C "$fixture/mover" commit --allow-empty -m remote-move >/dev/null
git -C "$fixture/mover" push origin main >/dev/null
make_mock_gh "$fixture"
run_release_helper_expect_failure "$fixture" "$validated_sha"
assert_no_tag_or_dispatch "$fixture"

# If another actor changes the remote after the bump push, the helper refuses
# to tag or dispatch publication. The git wrapper alters only this local test
# remote after the exact production push command succeeds.
fixture=$(mktemp -d)
fixture_dirs+=("$fixture")
validated_sha=$(new_git_fixture "$fixture")
git -C "$fixture/work" commit --allow-empty -m bump >/dev/null
git clone -b main "$fixture/remote.git" "$fixture/changer" >/dev/null 2>&1
git -C "$fixture/changer" config user.name workflow-contract-test
git -C "$fixture/changer" config user.email workflow-contract-test@example.invalid
git -C "$fixture/changer" config commit.gpgsign false
git -C "$fixture/changer" commit --allow-empty -m competing-update >/dev/null
conflict_sha=$(git -C "$fixture/changer" rev-parse HEAD)
git -C "$fixture/changer" push origin HEAD:refs/heads/side >/dev/null
make_mock_gh "$fixture"
real_git=$(command -v git)
cat > "$fixture/bin/git" <<'GIT'
#!/bin/bash
if [[ "$1" == push && "$2" == origin && "$3" == HEAD:refs/heads/main ]]; then
  "$REAL_GIT" "$@"
  status=$?
  if [[ "$status" == 0 ]]; then
    "$REAL_GIT" --git-dir="$TEST_REMOTE" update-ref refs/heads/main "$CONFLICT_SHA"
  fi
  exit "$status"
fi
exec "$REAL_GIT" "$@"
GIT
chmod +x "$fixture/bin/git"
set +e
(
  cd "$fixture/work"
  PATH="$fixture/bin:$PATH" GH_LOG="$fixture/gh.log" REAL_GIT="$real_git" TEST_REMOTE="$fixture/remote.git" CONFLICT_SHA="$conflict_sha" TAG=v1.2.3 DID_BUMP=true GITHUB_SHA="$validated_sha" RELEASE_BRANCH=main "$release_helper"
) >/dev/null 2>&1
status=$?
set -e
[[ "$status" != 0 ]] || fail 'remote mismatch after bump push must fail'
assert_no_tag_or_dispatch "$fixture"

# A remotely existing tag conflicts before any branch push and is never moved.
fixture=$(mktemp -d)
fixture_dirs+=("$fixture")
validated_sha=$(new_git_fixture "$fixture")
git -C "$fixture/work" tag v1.2.3 "$validated_sha"
git -C "$fixture/work" push origin refs/tags/v1.2.3 >/dev/null
git -C "$fixture/work" commit --allow-empty -m bump >/dev/null
make_mock_gh "$fixture"
run_release_helper_expect_failure "$fixture" "$validated_sha"
[[ $(git --git-dir="$fixture/remote.git" rev-parse refs/tags/v1.2.3) == "$validated_sha" ]] || fail 'conflicting tag was moved'
[[ $(git --git-dir="$fixture/remote.git" rev-parse refs/heads/main) == "$validated_sha" ]] || fail 'conflicting tag allowed branch push'
[[ ! -s "$fixture/gh.log" ]] || fail 'conflicting tag dispatched publisher'

# Inspect the real workflow and production helper for the release-state
# safeguards that do not execute on a pull request.
require 'go run github.com/rhysd/actionlint/cmd/actionlint@latest'
require './scripts/release-tag-and-dispatch.sh'
require './scripts/release-policy.sh "$TAG_NAME" "$CURRENT_VERSION" >> "$GITHUB_OUTPUT"'
require 'uses: softprops/action-gh-release@v2'
require 'npm publish --access=public --tag ${{ steps.policy.outputs.npm_dist_tag }}'
require 'needs: [route, node-lint-test, workflow-validation, build]'
[[ $(grep -Fc 'uses: softprops/action-gh-release@v2' "$workflow") == 1 ]] || fail 'only publisher may create GitHub Releases'
[[ $(grep -Fc 'npm publish --access=public' "$workflow") == 1 ]] || fail 'only publisher may publish npm'
forbidden_force_push='git[[:blank:]]+push([[:blank:]]+[^[:blank:]]+)*[[:blank:]]+(--force|-f)([[:blank:]]|$)'
unsafe_fixture=$(mktemp)
fixture_dirs+=("$unsafe_fixture")
for unsafe_command in 'git push origin --force' 'git push --force origin main' 'git push -f origin main' 'git reset --hard HEAD~1' 'git pull --rebase'; do
  printf '%s\n' "$unsafe_command" > "$unsafe_fixture"
  if [[ "$unsafe_command" == git\ push* ]]; then
    contains_forbidden_command "$forbidden_force_push" "$unsafe_fixture" || fail "force-push checker missed: $unsafe_command"
  else
    contains_forbidden_command 'git[[:blank:]]+(pull([[:blank:]]+--rebase)?|rebase|merge|reset)' "$unsafe_fixture" || fail "recovery checker missed: $unsafe_command"
  fi
done
forbid 'git[[:blank:]]+(pull([[:blank:]]+--rebase)?|rebase|merge|reset)' "$workflow" "$release_helper"
forbid "$forbidden_force_push" "$workflow" "$release_helper"
if grep -Eq '^  release:' "$workflow"; then fail 'release: published must not route into this workflow'; fi

echo "All CI workflow contract tests passed."
