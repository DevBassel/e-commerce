import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

interface emailConfig {
  to: string;
  subject: string;
  html: string;
}

export default ({ to, subject, html }: emailConfig) => {
  const config = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };

  transporter.sendMail(config, (err, info) => {
    if (err) console.log(err);
    else console.log({ emailInfo: info.response });
  });
};
