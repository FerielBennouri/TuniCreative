// controllers/contact.controller.js

import nodemailer from 'nodemailer';
import createError from "../utils/createError.js";

export const sendContactForm = async (req, res, next) => {
  

  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'bennouryferiel@gmail.com', // Replace with your support email
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error sending email:', error); // Debugging log
    next(createError(500, 'Failed to send message'));
  }
};
