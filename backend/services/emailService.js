// emailService.js

const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "spanditatech@gmail.com",
    pass: "fxzt rtcx wyig uzao",
  },
});

// Function to send an email
async function sendEmail(emailOptions) {
  try {
    await transporter.sendMail({
      from: "Your Task Management App spanditatech@gmail.com",
      ...emailOptions,
    });
    console.log("Email sent successfully:", emailOptions.to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = { sendEmail };
