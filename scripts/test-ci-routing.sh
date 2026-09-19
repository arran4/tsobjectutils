#!/bin/bash
set -euo pipefail

echo "Running CI workflow routing tests..."

# Use the actual routing script
ROUTE_SCRIPT="$(dirname "$0")/ci-route-logic.sh"

run_test() {
  local name=$1
  local event_name=$2
  local input_mode=$3
  local ref_type=$4
  local github_ref=$5
  local event_action=${6:-""}
  local event_schedule=${7:-""}

  local expected_publisher=$8
  local expected_release=$9
  local expected_exit_code=${10:-0}

  echo "Testing: $name"

  export EVENT_NAME=$event_name
  export INPUT_MODE=$input_mode
  export REF_TYPE=$ref_type
  export GITHUB_REF=$github_ref
  export EVENT_ACTION=$event_action
  export EVENT_SCHEDULE=$event_schedule
  export GITHUB_OUTPUT=$(mktemp)

  set +e
  /bin/bash "$ROUTE_SCRIPT" > /dev/null 2>&1
  local exit_code=$?
  set -e

  if [ "$exit_code" -ne "$expected_exit_code" ]; then
    echo "  FAIL: expected exit code $expected_exit_code, got $exit_code"
    cat "$GITHUB_OUTPUT"
    return 1
  fi

  if [ "$exit_code" -eq 0 ]; then
    local publisher=$(grep 'run_publisher=' "$GITHUB_OUTPUT" | cut -d= -f2)
    local release=$(grep 'run_release=' "$GITHUB_OUTPUT" | cut -d= -f2)

    if [ "$publisher" != "$expected_publisher" ]; then
      echo "  FAIL: expected run_publisher=$expected_publisher, got $publisher"
      return 1
    fi

    if [ "$release" != "$expected_release" ]; then
      echo "  FAIL: expected run_release=$expected_release, got $release"
      return 1
    fi
  fi

  echo "  PASS"
  rm "$GITHUB_OUTPUT"
}

run_test "Push to main (no publish)" "push" "" "branch" "refs/heads/main" "" "" "false" "false" 0 || (echo "FAILED"; false)
run_test "Publish-tag workflow (valid tag)" "workflow_dispatch" "publish-tag" "tag" "refs/tags/v1.0.0" "" "" "true" "false" 0 || (echo "FAILED"; false)
run_test "Publish-tag workflow (invalid ref, branch)" "workflow_dispatch" "publish-tag" "branch" "refs/heads/main" "" "" "false" "false" 1 || (echo "FAILED"; false)
run_test "Publish-tag workflow (invalid ref, no v prefix)" "workflow_dispatch" "publish-tag" "tag" "refs/tags/1.0.0" "" "" "false" "false" 1 || (echo "FAILED"; false)
run_test "Release preparation (release-minor)" "workflow_dispatch" "release-minor" "branch" "refs/heads/main" "" "" "false" "true" 0 || (echo "FAILED"; false)
run_test "Release preparation rejects feature branch" "workflow_dispatch" "release-minor" "branch" "refs/heads/feature" "" "" "false" "false" 1 || (echo "FAILED"; false)
run_test "Push tag v1.0.0 does not publish" "push" "" "tag" "refs/tags/v1.0.0" "" "" "false" "false" 0 || (echo "FAILED"; false)

echo "All routing tests passed."
