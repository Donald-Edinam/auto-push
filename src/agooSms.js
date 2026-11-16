// AgooSMS client.
// NOTE: Adjust the payload field names / auth header below to match the
// AgooSMS API docs from your dashboard if they differ.

async function sendSms({ to, message }) {
  const { AGOOSMS_API_URL, AGOOSMS_API_KEY, AGOOSMS_SENDER_ID, DRY_RUN } = process.env;

  if (DRY_RUN === 'true') {
    console.log(`[DRY_RUN] Would send to ${to}: "${message}"`);
    return { dryRun: true };
  }

  if (!AGOOSMS_API_URL || !AGOOSMS_API_KEY) {
    throw new Error('AGOOSMS_API_URL and AGOOSMS_API_KEY must be set in .env');
  }

  const res = await fetch(AGOOSMS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${AGOOSMS_API_KEY}`,
    },
    body: JSON.stringify({
      sender: AGOOSMS_SENDER_ID,
      recipient: to,
      message,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const body = await res.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    data = body;
  }

  if (!res.ok) {
    throw new Error(`AgooSMS error ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }
  return data;
}

module.exports = { sendSms };
