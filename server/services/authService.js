const randtoken = require('rand-token').generator();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.HOST_SMTP,
  port: process.env.PORT_SMTP,
  secure: false, 
  auth: {
    user: process.env.USER_SMTP, 
    pass: process.env.PASSWORD_SMTP, 
  },
});



exports.newToken = () => {
  return randtoken.generate(15, "abcdefghijklnmopqrstuvwxyz1234567890");
}



exports.sendGreetEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: process.env.USER_SMTP, 
      to: email, 
      subject: `Welcome to ${process.env.SITE_URL}`,
      text: "", 
      html: `
            <div>
              <h1>Thank you ${name} for registering!</h1>
              <h3>Start listening to tracks ⬇️</h3>
              <a href="${process.env.SITE_URL}/tracks">Link</a>
            </div>
           ` 
    });
  } catch (e) {
    console.log(e);
  }
}



exports.sendResetEmail = async (email, token) => {
  try {
    console.log(email);
    await transporter.sendMail({
      from: process.env.USER_SMTP, 
      to: email, 
      subject: "Reset password",
      text: "", 
      html: `
            <div>
              <h1>Reset password on the site ${process.env.SITE_URL}</h1>
              <h3>To reset your password follow the link ⬇️</h3>
              <a href="${process.env.SITE_URL}/auth/password/${token}">Link</a>
            </div>
           ` 
    });
  } catch (e) {
    console.log(e);
  }
}