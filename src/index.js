require('dotenv').config();
const express = require('express');
const { startScheduler, sendRandomMessage, state } = require('./scheduler');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'auto-push SMS scheduler' });
});

// See what the scheduler last did
app.get('/status', (req, res) => {
  res.json(state);
});

// Trigger a send immediately (useful for testing)
app.post('/send-now', async (req, res) => {
  try {
    const result = await sendRandomMessage();
    res.json({ ok: true, message: state.lastMessage, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  startScheduler();
});
