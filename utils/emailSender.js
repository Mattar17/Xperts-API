const mailer = require("nodemailer");
const codeModel = require("../models/code.model");

const transporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "mattarvalo@gmail.com",
    pass: process.env.GMAIL_PASSKEY,
  },
});

const sendEmail = async (email) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const verificationCodeModel = new codeModel({
    email,
    code,
  });

  await codeModel.insertOne(verificationCodeModel);
  const info = await transporter.sendMail({
    from: "mattarvalo@gmail.com",
    to: email,
    subject: "Hello",
    text: "Hello world?",
    html: `<p>Your verification code is <em>${code}</em></p>`, // plain‑text body
  });
};

module.exports = sendEmail;
