const randtoken = require('rand-token').generator();
const nodemailer = require('nodemailer');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authService = require('../services/authService');


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

exports.saveSession = (candidate, req, res) => {
  const user = candidate;
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
      if (err) {
        throw err
      }
      res.redirect('/')
    });
}


exports.findUserByToken = async (resetToken) => {
  return await User.findOne({resetToken});
}

exports.findUserByMail = async (email) => {
  return await User.findOne({email});
}


exports.saveUser = async (name, password, email) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const token = authService.newToken();

  const user = new User({
    name,
    email,
    password: hashPassword,
    albums: [],
    resetToken: token
  });

  await user.save();
}


exports.findUserByProp = async (req) => {
  return await User.findOne({
    _id: req.body.userId,
    resetToken: req.body.token
  })
}


exports.updateUserPassword = async (req, user) => {
  const newToken = authService.newToken();
  user.resetToken = newToken;
  user.password =  await bcrypt.hash(req.body.password, 10);
  await user.save();
}