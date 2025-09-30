#!/usr/bin/env bash
ADDR=${1:-0xddb4f1581aBe28684BFe0FBc55bDa34DbD0c6D0d}
curl -s -X POST http://localhost:8787/mint \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "'"$ADDR"'",
    "attestation": {
      "subject": "'"$ADDR"'",
      "type": 0,
      "nonce": "demo-'"$(date +%s)"'"
    }
  }' | jq .
