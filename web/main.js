const $ = (id) => document.getElementById(id);
const out = $('out');

$('mint').onclick = async () => {
  const api = $('api').value.trim();
  const recipient = $('recipient').value.trim();
  const type = Number($('type').value || 0);
  const nonce = $('nonce').value.trim() || Math.random().toString(36).slice(2);

  const attestation = {
    subject: recipient,
    type,
    nonce,
    // TODO: include real Soundness proof payload here
    proof: { dummy: true }
  };

  try {
    const r = await fetch(api + '/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attestation, recipient })
    });
    const j = await r.json();
    out.textContent = JSON.stringify(j, null, 2);
  } catch (e) {
    out.textContent = String(e);
  }
};
