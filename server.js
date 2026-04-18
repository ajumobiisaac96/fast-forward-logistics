require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add CSP and security headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:* https:; img-src 'self' data: https:; frame-src 'self';"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(express.static(path.join(__dirname)));

// Configure Nodemailer with Gmail (using app password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Fastforwardhumanresource2222@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password-here", // Use environment variable
  },
});

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("✓ Email service ready");
  }
});

// Route to send feedback
app.post("/api/submit-feedback", async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      phoneNumber,
      businessType,
      deliverySpeed,
      reliability,
      operationalChallenges,
      criticalIncidents,
      pricingPerception,
      valueAssessment,
      overallSatisfaction,
      improvements,
      desiredFeatures,
      recommendation,
    } = req.body;

    // Create email content
    const emailContent = `
      <h2>New Merchant Feedback Submission</h2>
      <hr />
      
      <h3>Business Information</h3>
      <p><strong>Business Name:</strong> ${businessName || "N/A"}</p>
      <p><strong>Contact Person:</strong> ${contactPerson || "N/A"}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber || "N/A"}</p>
      <p><strong>Business Type:</strong> ${businessType || "N/A"}</p>
      
      <h3>Service Experience</h3>
      <p><strong>Delivery Speed Rating:</strong> ${deliverySpeed || "N/A"}</p>
      <p><strong>Reliability & Handling Rating:</strong> ${reliability || "N/A"}</p>
      
      <h3>Pain Points & Value</h3>
      <p><strong>Operational Challenges:</strong></p>
      <p>${operationalChallenges || "N/A"}</p>
      
      <p><strong>Critical Incidents:</strong></p>
      <p>${criticalIncidents || "N/A"}</p>
      
      <p><strong>Pricing Perception:</strong> ${pricingPerception || "N/A"}</p>
      <p><strong>Value Assessment (Measurable ROI):</strong> ${valueAssessment || "N/A"}</p>
      
      <h3>Improvements & Satisfaction</h3>
      <p><strong>Overall Satisfaction:</strong> ${overallSatisfaction || "N/A"}</p>
      <p><strong>Areas for Improvement:</strong></p>
      <p>${improvements || "N/A"}</p>
      
      <p><strong>Desired Features:</strong></p>
      <p>${desiredFeatures || "N/A"}</p>
      
      <p><strong>Would Recommend:</strong> ${recommendation || "N/A"}</p>
      
      <hr />
      <p><em>Submitted via Fast-Forward Feedback System</em></p>
      <p><em>Timestamp: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email
    const mailOptions = {
      from: "Fastforwardhumanresource2222@gmail.com",
      to: "Fastforwardhumanresource2222@gmail.com",
      subject: `New Merchant Feedback - ${businessName || "Anonymous"}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully! Thank you for your response.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting feedback. Please try again later.",
      error: error.message,
    });
  }
});

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  Fast-Forward Feedback System                  ║
║  Server running on: http://localhost:${PORT}     ║
║  Email: Fastforwardhumanresource2222@gmail.com ║
╚════════════════════════════════════════════════╝
  `);
});
