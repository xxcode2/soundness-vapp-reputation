# zk-Verified Reputation Badge (PoC)

A proof-of-concept vApp for the **Soundness Layer**.  
This project demonstrates how users can mint **ERC-721 badges** that are gated by **Soundness attestations**.

Currently, attestation verification is a **stub (dummy)**, but the full flow works:
- Solidity contract for badge minting.
- Node.js API for attestation verification + contract calls.
- Vite web UI for interacting with the API.

---

## 📂 Project Structure
soundness-vapp-reputation/
├── contracts/ # Hardhat project, Solidity contract
│ ├── contracts/Badge.sol
│ ├── scripts/deploy.js
│ └── hardhat.config.js
├── api/ # Node.js + Express backend
│ ├── index.js
│ ├── package.json
│ └── .env.example
└── web/ # Frontend Vite app
├── index.html
├── main.js
└── package.json

yaml
Copy code

---

## ⚖️ Contracts
### Deploy
```bash
cd contracts
cp .env.example .env   # fill in PRIVATE_KEY, RPC_URL, CHAIN_ID
npx hardhat compile
npx hardhat run scripts/deploy.js --network custom
Example output:

css
Copy code
SoundnessBadge deployed to: 0x364b479524767725c71c4C640778476a0a1321BB
⚙️ API
Run server
bash
Copy code
cd api
cp .env.example .env   # fill in PRIVATE_KEY, RPC_URL, BADGE_ADDRESS, CHAIN_ID
npm install
npm run dev
Server runs at http://localhost:8787.

Endpoints
Health check

bash
Copy code
curl http://localhost:8787/health
→ {"ok":true,"network":1001}

Mint badge

bash
Copy code
curl -X POST http://localhost:8787/mint \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0xYourWallet",
    "attestation": {
      "subject": "0xYourWallet",
      "type": 0,
      "nonce": "demo-12345"
    }
  }'
Response:

json
Copy code
{
  "ok": true,
  "txHash": "0x...",
  "attHash": "0x..."
}
🌐 Web UI
Run locally
bash
Copy code
cd web
npm install
npm run dev -- --host
Open in browser:
http://<YOUR_VPS_IP>:5173/
```
⚠️ Important: set API Base URL to http://<YOUR_VPS_IP>:8787.

📌 Current Status
✅ Contract deployed & minting works

✅ API stub verification + hashing

✅ Web UI integration with API

❌ Soundness SDK integration (pending official release)

🚀 Next Steps
Replace stub verification with real Soundness SDK.

Add badge metadata / tokenURI.

Optional: convert to Soulbound Token (SBT).

Deploy on a public testnet with demo-ready UI.

👤 Developer
Name: Axell

GitHub: @xxcode2

Discord: xxcode#3630
