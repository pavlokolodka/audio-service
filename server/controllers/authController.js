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
    const candidate = await authService.findUserByMail(email)
  
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login');
    }

    authService.saveSession(candidate, req, res);
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
   
    await authService.saveUser(name, password, email);
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
    const candidate = await authService.findUserByMail(email);
    
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

  const resetToken =  req.params.token;

  try {
    const user = await authService.findUserByToken(resetToken);
    
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

    const user = await authService.findUserByProp(req);

    if (!user) {
      req.flash('error', 'User with this token not found')
      return res.redirect('/auth/login');
    } 

    await authService.updateUserPassword(req, user);
    res.redirect('/auth/login')
  } catch (e) {
    console.log(e)
  }
 }