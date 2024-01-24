#!/usr/bin/env zsh
 node ../build/src/entry.js \
  --network='http://localhost:3085/graphql' \
  --sender-private-key='' \
  --wallet-list='walletList.txt' \
  --transaction-type=zkApp \
  --path-to-sender-private-key='' \
  --password-for-sender-private-key='' \
  --transaction-count=100 \
  --transaction-interval=5000 \

# Use rampup-8 branch.
