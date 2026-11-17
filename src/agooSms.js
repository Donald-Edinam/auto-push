// AgooSMS client — https://developer.agoosms.com/dashboard/docs
//
// POST https://api.agoosms.com/v1/sms/send
// Headers: X-API-Key: <key>, Content-Type: application/json
// Body:    { "to": "+233201234567", "message": "...", "senderId": "MyBrand" }
//
// Success: { success: true,  data: { messageId, to, segments, cost, balance, status }, meta: {...} }
// Error:   { success: false, error: { code, message } }   e.g. INVALID_API_KEY, INSUFFICIENT_BALANCE, RATE_LIMIT_EXCEEDED

const DEFAULT_API_URL = 'https://api.agoosms.com/v1/sms/send';

async function sendSms({ to, message }) {
  const { AGOOSMS_API_URL, AGOOSMS_API_KEY, AGOOSMS_SENDER_ID, DRY_RUN } = process.env;

  if (DRY_RUN === 'true') {
    console.log(`[DRY_RUN] Would send to ${to}: "${message}"`);
    return { dryRun: true };
  }

  if (!AGOOSMS_API_KEY) throw new Error('AGOOSMS_API_KEY must be set in .env');

  const payload = { to, message };
  // senderId is optional; without an approved one AgooSMS uses its default.
  if (AGOOSMS_SENDER_ID) payload.senderId = AGOOSMS_SENDER_ID;

  const res = await fetch(AGOOSMS_API_URL || DEFAULT_API_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': AGOOSMS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`AgooSMS returned non-JSON response (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok || data.success === false) {
    const code = data.error?.code || `HTTP_${res.status}`;
    const msg = data.error?.message || text.slice(0, 200);
    throw new Error(`AgooSMS ${code}: ${msg}`);
  }

  return data.data; // { messageId, to, segments, cost, balance, status }
}

module.exports = { sendSms };
