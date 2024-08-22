import nodemailer from "nodemailer";

export const sender = {
  email: process.env.SENDERS_MAIL,
  name: "EvitalRx_Auth",
};

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.SENDERS_MAIL,
    pass: process.env.SENDERS_PASSWORD,
  },
});
