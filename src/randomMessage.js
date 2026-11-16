const messages = require('./messages');

let lastId = null;

// Pick a random message, avoiding sending the same one twice in a row.
function pickRandomMessage() {
  if (!messages.length) throw new Error('No messages configured in src/messages.js');
  if (messages.length === 1) return messages[0];

  let msg;
  do {
    msg = messages[Math.floor(Math.random() * messages.length)];
  } while (msg.id === lastId);

  lastId = msg.id;
  return msg;
}

module.exports = { pickRandomMessage };
