# Fast-Forward Merchant Feedback Survey

A short, single-page interactive CSAT/NPS survey for e-commerce merchants who use Fast-Forward
Logistics for delivery fulfillment. Submissions are emailed to the team and optionally pinged to
a WhatsApp number via CallMeBot.

## Live architecture (Netlify)

```
index.html                        Landing page -> links to survey.html
survey.html                       The 5-question interactive survey (single page, no reloads)
thank-you.html                    Post-submit confirmation + WhatsApp contact link
images/logo.png                   Company logo
netlify/functions/submit-feedback.js   Serverless function: emails the response, pings WhatsApp
netlify.toml                      Netlify build + redirect config
.env.example                      Template for required environment variables
```

Everything else in this repo (`step 1`-`step 4`, `welcome page/`, `thank you page/`, `forms.js`,
`api/`, `server.js`, `vercel.json`, `VERCEL_DEPLOYMENT.md`) is the **old 4-step / 14-field version,
earlier landing and thank-you drafts, and alternate Vercel/Express deploy paths. They are unused** and
kept only so nothing already built is lost. Netlify (via `netlify/functions/submit-feedback.js`)
is the one deployment target the live site actually talks to.

## The 5 questions

1. Overall satisfaction (CSAT, 5-point scale)
2. Delivery speed & reliability (4-point scale)
3. Communication / delivery updates (5-point scale)
4. Likelihood to recommend (NPS, 0-10)
5. Open-ended improvement suggestion + optional phone number for follow-up

## Setup

### 1. Install dependencies (for local `netlify dev` testing)

```bash
npm install -g netlify-cli
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` for local testing:

```bash
cp .env.example .env
```

Fill in:

- `EMAIL_USER` / `EMAIL_PASSWORD` - a Gmail account + [App Password](https://myaccount.google.com/apppasswords) (requires 2FA on that Gmail account). The old App Password was never recoverable once the original `.env` was lost — generate a new one.
- `FEEDBACK_TO_EMAIL` - where the feedback email should land.
- `WHATSAPP_PHONE` / `WHATSAPP_APIKEY` - optional. See "WhatsApp notifications" below. Leave blank to skip WhatsApp entirely; email still works.

**In production**, set the same variable names in the Netlify dashboard: Site settings ->
Environment variables. Never commit a real `.env` file.

### 3. Run locally

```bash
netlify dev
```

### 4. Deploy

Push to the branch connected to your Netlify site, or run `netlify deploy --prod`.

## WhatsApp notifications (CallMeBot)

No Meta business verification needed. One-time setup, done from **+234 813 603 3584**
(the client's WhatsApp number that should receive pings):

1. From that phone, save `+34 644 84 71 64` as a contact.
2. Send that contact the WhatsApp message: `I allow callmebot to send me messages`
3. CallMeBot replies with an API key.
4. Set these in your environment variables:
   - `WHATSAPP_PHONE=2348136033584`
   - `WHATSAPP_APIKEY=<the key CallMeBot just sent back>`

Every submission then sends a WhatsApp message with the merchant's answers and follow-up number
to that one number. This is best-effort — a WhatsApp failure never blocks the email, which
remains the system of record for CSAT/NPS tracking.

## API

### POST `/.netlify/functions/submit-feedback`

**Request body:**

```json
{
  "csat": "very-satisfied | satisfied | neutral | dissatisfied | very-dissatisfied",
  "deliveryReliability": "excellent | good | average | poor",
  "communication": "very-satisfied | satisfied | neutral | dissatisfied | very-dissatisfied",
  "nps": "0-10",
  "improvement": "free text, optional",
  "phoneNumber": "free text, optional"
}
```

`csat`, `deliveryReliability`, `communication`, and `nps` are required; `improvement` and
`phoneNumber` are optional.

**Response:**

```json
{ "success": true, "message": "Feedback submitted successfully! Thank you for your response." }
```

## Browser support

Chrome/Edge/Firefox/Safari (latest), and mobile Safari/Chrome. Built mobile-first.

## Support

csmfastforward@gmail.com
