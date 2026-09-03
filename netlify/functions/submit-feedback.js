const nodemailer = require("nodemailer");

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const RATING_LABELS = {
  csat: {
    "very-satisfied": "Very satisfied",
    satisfied: "Satisfied",
    neutral: "Neutral",
    dissatisfied: "Dissatisfied",
    "very-dissatisfied": "Very dissatisfied",
  },
  deliveryReliability: {
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
  },
  communication: {
    "very-satisfied": "Very satisfied",
    satisfied: "Satisfied",
    neutral: "Neutral",
    dissatisfied: "Dissatisfied",
    "very-dissatisfied": "Very dissatisfied",
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sends the WhatsApp ping via CallMeBot. Best-effort: failures here must never
// block a successful email submission, since email is the system of record.
async function sendWhatsAppNotification(payload) {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_APIKEY;
  if (!phone || !apiKey) return;

  const lines = [
    "New Fast-Forward merchant feedback:",
    `CSAT: ${RATING_LABELS.csat[payload.csat]}`,
    `Delivery speed & reliability: ${RATING_LABELS.deliveryReliability[payload.deliveryReliability]}`,
    `Communication: ${RATING_LABELS.communication[payload.communication]}`,
    `Recommend likelihood (0-10): ${payload.nps}`,
  ];
  if (payload.improvement) lines.push(`Improvement note: ${payload.improvement}`);
  if (payload.phoneNumber) lines.push(`Merchant contact: ${payload.phoneNumber}`);

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(lines.join("\n"))}&apikey=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CallMeBot responded with ${response.status}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Invalid request body" }),
    };
  }

  const { csat, deliveryReliability, communication, nps, improvement, phoneNumber } = payload;

  // Each rating must be one of the values the form actually offers. This keeps
  // unexpected input out of the email (the subject line is a mail header, so an
  // unvalidated value there would be a header-injection vector) and stops junk
  // values from polluting the CSAT/NPS figures.
  const npsValue = String(nps).trim();
  const isValidNps = /^(10|[0-9])$/.test(npsValue);

  if (
    !RATING_LABELS.csat[csat] ||
    !RATING_LABELS.deliveryReliability[deliveryReliability] ||
    !RATING_LABELS.communication[communication] ||
    !isValidNps
  ) {
    return {
      statusCode: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Missing or invalid answers" }),
    };
  }

  const emailContent = `
    <h2>New Merchant Feedback Submission</h2>
    <hr />
    <p><strong>Overall satisfaction (CSAT):</strong> ${escapeHtml(RATING_LABELS.csat[csat])}</p>
    <p><strong>Delivery speed &amp; reliability:</strong> ${escapeHtml(RATING_LABELS.deliveryReliability[deliveryReliability])}</p>
    <p><strong>Communication &amp; updates:</strong> ${escapeHtml(RATING_LABELS.communication[communication])}</p>
    <p><strong>Likelihood to recommend (0-10 NPS):</strong> ${escapeHtml(npsValue)}</p>
    <p><strong>What could we improve:</strong></p>
    <p>${improvement ? escapeHtml(improvement) : "N/A"}</p>
    <p><strong>Merchant follow-up number:</strong> ${phoneNumber ? escapeHtml(phoneNumber) : "Not provided"}</p>
    <hr />
    <p><em>Submitted via Fast-Forward Feedback Survey</em></p>
    <p><em>Timestamp: ${new Date().toLocaleString()}</em></p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_TO_EMAIL || process.env.EMAIL_USER,
      subject: `New Merchant Feedback - CSAT: ${RATING_LABELS.csat[csat]}`,
      html: emailContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        message: "Error submitting feedback. Please try again later.",
        error: error.message,
      }),
    };
  }

  try {
    await sendWhatsAppNotification({ csat, deliveryReliability, communication, nps: npsValue, improvement, phoneNumber });
  } catch (error) {
    console.error("WhatsApp notification failed (non-fatal):", error);
  }

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify({
      success: true,
      message: "Feedback submitted successfully! Thank you for your response.",
    }),
  };
};
