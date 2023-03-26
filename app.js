// Import packages
const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
async function sendEmail() {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'recipient@example.com',
      subject: 'Scheduled Email',
      text: 'Hello, this is a scheduled email from your Node.js email scheduler!',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}

// Schedule email
const schedule = '0 */2 * * *'; // This will send the email every 2 hours
cron.schedule(schedule, sendEmail);
