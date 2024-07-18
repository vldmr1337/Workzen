const nodemailer = require('nodemailer');
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

module.exports = transporter;
