const nodemailer = require("nodemailer");

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    // Validate required fields
    if (!businessName || !contactPerson || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Merchant Feedback - ${businessName || "Anonymous"}`,
      html: emailContent,
    });

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully! Thank you for your response.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting feedback. Please try again later.",
      error: error.message,
    });
  }
};
