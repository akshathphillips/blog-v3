#!/usr/bin/env bash
# Build and deploy blog-v3 to S3.
set -euo pipefail
cd "$(dirname "$0")/.."

BUCKET="${1:-akshathphillips-blog}"

node build.js
aws s3 sync dist/ "s3://$BUCKET" --delete
aws cloudfront create-invalidation --distribution-id EQN2AJKUYY6HI --paths "/*" >/dev/null
echo "Deployed → https://www.akshathphillips.com"
