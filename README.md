# auto-push

Express + Node.js app that sends a **randomly selected SMS** to a phone number **every 5 minutes** using **AgooSMS**.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
npm start
```

## Configuration (`.env`)

| Variable | Description |
|---|---|
| `RECIPIENT_PHONE` | Number to text, international format (e.g. `233XXXXXXXXX`) |
| `AGOOSMS_API_URL` | AgooSMS send endpoint (from your AgooSMS docs/dashboard) |
| `AGOOSMS_API_KEY` | Your AgooSMS API key |
| `AGOOSMS_SENDER_ID` | Approved sender ID |
| `CRON_SCHEDULE` | Defaults to `*/5 * * * *` (every 5 minutes) |
| `CRON_TIMEZONE` | Optional, e.g. `Africa/Accra` |
| `DRY_RUN` | `true` logs messages instead of sending |

> If AgooSMS uses different field names or auth (e.g. `api_key` in the body instead of a Bearer header), edit `src/agooSms.js`; it's the only file that talks to the provider.

## Messages

Edit `src/messages.js`. Each run picks one at random and never sends the same one twice in a row.

## Endpoints

- `GET /` health check
- `GET /status` shows last run, last message, last error and the sent count
- `POST /send-now` sends a random message immediately
