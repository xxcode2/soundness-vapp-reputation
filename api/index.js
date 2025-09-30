import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ethers } from 'ethers';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const {
  PORT = 8787,
  RPC_URL,
  PRIVATE_KEY,
  BADGE_ADDRESS,
  CHAIN_ID
} = process.env;

if (!RPC_URL) console.warn('WARN: RPC_URL not set');
if (!PRIVATE_KEY) console.warn('WARN: PRIVATE_KEY not set');
if (!BADGE_ADDRESS) console.warn('WARN: BADGE_ADDRESS not set');

const provider = RPC_URL ? new ethers.JsonRpcProvider(RPC_URL, Number(CHAIN_ID || 0)) : null;
const wallet = provider && PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

const abi = [
  "function mintWithAttestation(address to, bytes32 attestationHash, uint8 t) external",
  "function owner() view returns (address)"
];

const badge = (wallet && BADGE_ADDRESS) ? new ethers.Contract(BADGE_ADDRESS, abi, wallet) : null;

app.get('/health', async (_req, res) => {
  try {
    const net = provider ? await provider.getNetwork() : null;
    res.json({ ok: true, network: net ? Number(net.chainId) : null });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// --- Replace this with REAL Soundness verification once available ---
function verifySoundnessAttestation(att) {
  if (!att || typeof att !== 'object') return { ok: false, error: 'No attestation' };
  const { subject, type, nonce } = att;
  if (!/^0x[0-9a-fA-F]{40}$/.test(subject || '')) return { ok: false, error: 'Bad subject' };
  if (typeof type !== 'number') return { ok: false, error: 'Bad type' };
  if (!nonce || String(nonce).length < 6) return { ok: false, error: 'Bad nonce' };
  return { ok: true };
}

function canonicalize(att) {
  const picked = { subject: att.subject, type: att.type, nonce: att.nonce };
  return JSON.stringify(picked);
}

app.post('/mint', async (req, res) => {
  try {
    if (!badge) return res.status(500).json({ ok: false, error: 'Contract not configured' });

    const { attestation, recipient } = req.body || {};
    const v = verifySoundnessAttestation(attestation);
    if (!v.ok) return res.status(400).json({ ok: false, error: v.error });

    if ((attestation.subject || '').toLowerCase() !== (recipient || '').toLowerCase()) {
      return res.status(400).json({ ok: false, error: 'Subject mismatch' });
    }

    const canonical = canonicalize(attestation);
    const attHash = '0x' + crypto.createHash('sha256').update(canonical).digest('hex');

    const typeCode = Number(attestation.type || 0);

    console.log("➡️ Minting badge...");
    console.log("   Recipient:", recipient);
    console.log("   Attestation hash:", attHash);
    console.log("   Type:", typeCode);

    const tx = await badge.mintWithAttestation(recipient, attHash, typeCode);
console.log("   Tx sent:", tx.hash);

const receipt = await tx.wait();
console.log("   Tx mined:", receipt.hash || receipt.transactionHash);

res.json({
  ok: true,
  txHash: tx.hash, // fallback langsung dari tx
  attHash
});

  } catch (e) {
    console.error("❌ Mint error:", e);
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

