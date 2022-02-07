const User = require('../models/user');
const bcrypt = require('bcrypt');
const authService = require('../services/authService');
const {validationResult} = require('express-validator');






exports.getLoginPage = (req, res) => {
  try {
    res.render('auth/login', {
      title: 'Sign in',
      loginError: req.flash('loginError')
    });
  } catch (e) {
    console.log(e);
  }
}



exports.getRegisterPage = (req, res) => {
  try {
    res.render('auth/register', {
      title: 'Sign up',
      registerError: req.flash('registerError')
    });
  } catch (e) {
    console.log(e);
  }
}



exports.login = async (req, res) => {
  try {
    const {email} = req.body;
    const candidate = await User.findOne({email});

    /*if (!candidate) {
      return res.status(400).json({message: `User with this email ${email} not found`});
    }

    const comparePassword = await bcrypt.compare(password, candidate.password);

    if (!comparePassword) {
      return res.status(400).json({message: 'Wrong password'});
    }*/

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login');
    }

    const user = candidate;
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save(err => {
      if (err) {
        throw err
      }
      res.redirect('/')
    });
  } catch (e) {
    console.log(e);
  }
}



exports.register = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/register');
    }
    /*if (candidate) {
      return res.status(400).json({message: 'User with this email already exist'});
    }*/

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
    await authService.sendGreetEmail(name, email);
    res.redirect('/auth/login');
  } catch (e) {
    console.log(e);
  }
}



exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login') 
  })
}



exports.getResetPage = (req, res) => {
  res.render('auth/reset', {
    title: 'Reset password'
  })
}



exports.reset = async (req, res) => {
  try {
    const {email} = req.body;
    const candidate = await User.findOne({email});

    if (!candidate) {
      return res.status(400).json({message: 'User with this email not exist'});
    }

    await authService.sendResetEmail(email, candidate.resetToken);

    
    res.redirect('/auth/login');
  } catch (e) {
    console.log(e);
  }
 }



 exports.getPasswordPage = async (req, res) => {
  if (!req.params.token) {
    req.flash('error', 'Token expired')
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
    resetToken: req.params.token
    });
   
  if (!user) {
    req.flash('error', 'User with this token not found')
    return res.redirect('/auth/login');
  }

  res.render('auth/password', {
    title: "Recovery password",
    error: req.flash('error'),
    userId: user._id.toString(),
    token: req.params.token
  })
  } catch (e) {
    console.log(e)
  }
 }



 exports.newPassword = async (req, res) => {
  try { 
    const errors = validationResult(req);
    const token = req.body.token;
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.status(422).redirect(`/auth/password/${token}`);
    }

    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token
    })

    if (!user) {
      req.flash('error', 'User with this token not found')
      return res.redirect('/auth/login');
    } 

    const newToken = authService.newToken();
    user.resetToken = newToken;
    user.password =  await bcrypt.hash(req.body.password, 10);
    await user.save();
    res.redirect('/auth/login')
  } catch (e) {
    console.log(e)
  }
 }