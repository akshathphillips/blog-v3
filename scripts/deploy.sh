#!/usr/bin/env bash
# Build and deploy blog-v3 to S3.
set -euo pipefail
cd "$(dirname "$0")/.."

BUCKET="${1:-akshathphillips-blog}"

node build.js
aws s3 sync dist/ "s3://$BUCKET" --delete
echo "Deployed → http://$BUCKET.s3-website-us-east-1.amazonaws.com"
