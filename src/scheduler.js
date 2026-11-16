const cron = require('node-cron');
const { sendSms } = require('./agooSms');
const { pickRandomMessage } = require('./randomMessage');

const state = {
  lastRunAt: null,
  lastMessage: null,
  lastResult: null,
  lastError: null,
  sentCount: 0,
};

let running = false;

async function sendRandomMessage() {
  if (running) {
    console.warn('Previous send still in progress — skipping this tick.');
    return;
  }
  running = true;

  const to = process.env.RECIPIENT_PHONE;
  const msg = pickRandomMessage();
  state.lastRunAt = new Date().toISOString();
  state.lastMessage = msg;

  try {
    if (!to) throw new Error('RECIPIENT_PHONE is not set in .env');
    const result = await sendSms({ to, message: msg.text });
    state.lastResult = result;
    state.lastError = null;
    state.sentCount += 1;
    console.log(`[${state.lastRunAt}] Sent message #${msg.id} to ${to}`);
    return result;
  } catch (err) {
    state.lastError = err.message;
    console.error(`[${state.lastRunAt}] Failed to send message #${msg.id}:`, err.message);
    throw err;
  } finally {
    running = false;
  }
}

function startScheduler() {
  const schedule = process.env.CRON_SCHEDULE || '*/5 * * * *';
  if (!cron.validate(schedule)) throw new Error(`Invalid CRON_SCHEDULE: ${schedule}`);

  const options = {};
  if (process.env.CRON_TIMEZONE) options.timezone = process.env.CRON_TIMEZONE;

  const task = cron.schedule(schedule, () => {
    sendRandomMessage().catch(() => {}); // already logged
  }, options);

  console.log(`SMS cron job scheduled: "${schedule}"`);
  return task;
}

module.exports = { startScheduler, sendRandomMessage, state };
