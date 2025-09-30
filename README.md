# zk-Verified Reputation Badge (Starter)

A minimal end-to-end starter for a **badge NFT** that is minted only when a user presents a **verifiable attestation** from the **Soundness Layer**.

> This is a scaffold intended to be **chain-agnostic** on the verification side and **EVM-compatible** for the badge contract. The API currently uses a **stubbed verifier**. Replace the stub with actual Soundness attestation verification once docs/SDK are available.

## What you get
- **contracts/** — ERC‑721 Badge contract with a safe `mintWithAttestation` gate
- **api/** — Node/Express server that receives an attestation, verifies it (stub), and calls the contract
- **web/** — Tiny Vite app to submit an attestation and mint
- **MIT License**

## Quick start
### 1) Contracts
```bash
cd contracts
npm i
# configure your RPC + PRIVATE_KEY in .env (see comments in hardhat.config.js)
npx hardhat compile
npx hardhat run scripts/deploy.js --network <yourNetwork>
```
Record the deployed **Badge** address and paste it into `api/.env` and `web/main.js`.

### 2) API
```bash
cd ../api
npm i
cp .env.example .env
# set RPC_URL, PRIVATE_KEY (the minter/operator), BADGE_ADDRESS, and CHAIN_ID
npm run dev
```
The API exposes:
- `POST /mint` — `{ attestation, recipient }` → verifies + mints
- `GET /health` — sanity check

### 3) Web
```bash
cd ../web
npm i
npm run dev
```
Open the local URL and try minting with a **dummy attestation** (until real Soundness verification is wired).

## Replacing the verifier (important)
1. Open **api/index.js** and replace `verifySoundnessAttestation(att)` with the official verification (sig/merkle/SNARK) as per Soundness docs.
2. Ensure the verifier yields:
   - `subject` (wallet address that proved),
   - `type` (which badge logic applies),
   - `nonce` (to prevent replay),
   - `score` or `count` (optional gating).
3. Pass a **hash** of the attestation into the contract call to bind on-chain state to the off-chain proof (included already).

## Security notes
- Contract implements **replay protection** via `usedAttestation[hash]`.
- API re-checks subject matches `recipient` before minting.
- Consider rate limiting and attestation expiry once integrated.

---

### (Optional) Alternative targets
- Swap EVM contracts for **Sui Move** or **Walrus** program and keep the same API shape.
- Keep the web & API identical; just change the minting backend.

Good luck & have fun! 🐬
