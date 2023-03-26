// Import packages
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
require('dotenv').config();

// Read email configurations from config.json
const emailConfig = require('./config.json');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
async function sendEmail(recipients, subject, text, attachments) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: subject,
      text: text,
      attachments: attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
}

// Schedule emails
emailConfig.schedules.forEach((schedule) => {
  // Prepare attachments
  const attachments = schedule.attachments.map((attachment) => ({
    filename: attachment.filename,
    path: attachment.path,
    contentType: attachment.contentType || 'application/octet-stream',
  }));

  cron.schedule(schedule.schedule, () => {
    sendEmail(
      schedule.recipients.join(', '),
      schedule.subject,
      schedule.text,
      attachments
    );
  });
});
