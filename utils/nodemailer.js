const nodemailer = require("nodemailer");

function generateStudentNumber() {
  // Generate a random 8-digit student number starting with 22
  const studentNumber = `22${Math.floor(10000000 + Math.random() * 90000000)}`;
  return studentNumber;
}

async function sendMessage(userName, userEmail, userSubject, userMessage) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.APP_USER, // email
      pass: process.env.APP_PASSWORD, // app password
    },
  });

  // Send user's message
  let info = await transporter.sendMail({
    sender: `${userEmail}`,
    from: `${userEmail}`, // sender address
    to: "goodnessjakazac@gmail.com",
    replyTo: `${userEmail}`,
    subject: `${userSubject}`, // Subject line
    text: `${userMessage}`, // plain text body
    html: `<b>${userMessage}</b>`, // html body
  });

  // Generate and send confirmation email with student number
  const studentNumber = generateStudentNumber();
  info = await transporter.sendMail({
    sender: "goodnessjakazac@gmail.com",
    from: "goodnessjakazac@gmail.com", // sender address
    to: `${userEmail}`,
    replyTo: 'goodnessjakazac@gmail.com',
    subject: `Registration Confirmation`, // Subject line
    text: `Hey ${userName}, Your student number is: ${studentNumber}`, // plain text body
    html: `
      <p>Dear <b>${userName}</b>,</p>
      <p>Your registration was successful!</p>
      <p>Your student number is: <b>${studentNumber}</b></p>
      <p>This is to confirm that we have received your registration details.</p>
      <p>We will get back to you as soon as possible.</p>
      <p>Regards,</p>
      <p>Themba G Chauke</p>
    `, // html body
  });
}

//module.exports = { sendMessage };
