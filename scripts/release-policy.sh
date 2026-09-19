#!/bin/bash
set -euo pipefail

# This is invoked by the publisher job. Keep the channel decision here so the
# workflow contract tests exercise the same code that gates publication.
tag_name=${1:?tag name is required}
package_version=${2:?package version is required}

if ! [[ "$tag_name" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z]+(\.[0-9A-Za-z]+)*)?$ ]]; then
  echo "Error: $tag_name is not an eligible release tag." >&2
  exit 1
fi

if [[ "$tag_name" != "v${package_version}" ]]; then
  echo "Error: Tag $tag_name does not match package version $package_version." >&2
  exit 1
fi

create_github_release=true
prepare_next=false
if [[ "$package_version" == *-next ]]; then
  # A bare -next tag is the repository's development marker: visible as a
  # prerelease on GitHub, but deliberately absent from npm.
  prerelease=true
  publish_npm=false
  npm_dist_tag=none
elif [[ "$package_version" == *-* ]]; then
  prerelease=true
  publish_npm=true
  npm_dist_tag=next
else
  prerelease=false
  publish_npm=true
  npm_dist_tag=latest
  prepare_next=true
fi

echo "create_github_release=$create_github_release"
echo "prerelease=$prerelease"
echo "publish_npm=$publish_npm"
echo "npm_dist_tag=$npm_dist_tag"
echo "prepare_next=$prepare_next"
