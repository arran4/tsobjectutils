#!/bin/bash
set -euo pipefail
run_code_checks=true
run_build=true
run_release=false
run_autofix=false
run_publisher=false
run_maintenance=false
is_nightly=false
is_monthly=false
mode="build"

if [[ "$EVENT_NAME" == "pull_request" ]]; then
  if [[ "$EVENT_ACTION" == "closed" ]]; then
      # Closed PRs just clean up
      run_code_checks=false
      run_build=false
  fi
elif [[ "$EVENT_NAME" == "schedule" ]]; then
  if [[ "$EVENT_SCHEDULE" == "17 3 1 * *" ]]; then
      run_maintenance=true
      is_monthly=true
      mode="monthly-maintenance"
  else
      run_autofix=true
      is_nightly=true
      mode="lint-fix"
  fi
elif [[ "$EVENT_NAME" == "workflow_dispatch" ]]; then
  mode="${INPUT_MODE:-build}"
  if [[ "$mode" == "lint-fix" ]]; then
      run_autofix=true
      is_nightly=true
  elif [[ "$mode" == "publish-tag" ]]; then
      # The internal explicit publish-tag dispatch mode
      if [[ "$REF_TYPE" == "tag" && "$GITHUB_REF" == refs/tags/v* ]]; then
        run_code_checks=false
        run_build=false
        run_publisher=true
      else
        echo "Error: publish-tag mode requires a v* tag context. Found: $GITHUB_REF" >&2
        sh -c "exit 1"
      fi
  elif [[ "$mode" == release-* ]]; then
      run_release=true
  elif [[ "$mode" == "monthly-maintenance" ]]; then
      run_maintenance=true
      is_monthly=true
  fi
elif [[ "$EVENT_NAME" == "push" && "$REF_TYPE" == "tag" && "$GITHUB_REF" == refs/tags/v* ]]; then
    # Standard external v* push publication
    run_publisher=true
fi

echo "run_code_checks=$run_code_checks" >> "$GITHUB_OUTPUT"
echo "run_build=$run_build" >> "$GITHUB_OUTPUT"
echo "run_release=$run_release" >> "$GITHUB_OUTPUT"
echo "run_autofix=$run_autofix" >> "$GITHUB_OUTPUT"
echo "run_publisher=$run_publisher" >> "$GITHUB_OUTPUT"
echo "run_maintenance=$run_maintenance" >> "$GITHUB_OUTPUT"
echo "is_nightly=$is_nightly" >> "$GITHUB_OUTPUT"
echo "is_monthly=$is_monthly" >> "$GITHUB_OUTPUT"
echo "mode=$mode" >> "$GITHUB_OUTPUT"
