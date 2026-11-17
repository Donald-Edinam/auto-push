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
| `RECIPIENT_PHONE` | Number to text, E.164 format (e.g. `+233201234567`) |
| `AGOOSMS_API_KEY` | Your AgooSMS API key (`agoo_live_...`) from https://developer.agoosms.com |
| `AGOOSMS_SENDER_ID` | Optional approved sender ID; blank uses AgooSMS's default |
| `AGOOSMS_API_URL` | Optional; defaults to `https://api.agoosms.com/v1/sms/send` |
| `CRON_SCHEDULE` | Defaults to `*/5 * * * *` (every 5 minutes) |
| `CRON_TIMEZONE` | Optional, e.g. `Africa/Accra` |
| `DRY_RUN` | `true` logs messages instead of sending |

The AgooSMS integration lives in `src/agooSms.js`. It follows the
[AgooSMS API docs](https://developer.agoosms.com/dashboard/docs): `POST /v1/sms/send` with an
`X-API-Key` header and a JSON body of `{ to, message, senderId }`.

## Messages

Edit `src/messages.js`. Each run picks one at random and never sends the same one twice in a row.

## Endpoints

- `GET /` health check
- `GET /status` shows last run, last message, last error and the sent count
- `POST /send-now` sends a random message immediately
