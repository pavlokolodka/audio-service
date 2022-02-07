const {body} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');




exports.loginValidator = [
  body('email')
  .isEmail().withMessage('Input correct email')
  .custom(async (value, {req}) => {
    try {
      const user = await User.findOne({email: value});
      if (!user) {
        return Promise.reject('User with this email not exists');
      }
    } catch (e) {
      console.log(e);
    }
  })
  .normalizeEmail({gmail_remove_dots: false}),
  body('password', 'Password must be at least 6 characters')
  .isLength({min: 6, max: 20})
  .custom(async (value, {req}) => {
    try {
      const candidate = await User.findOne({email: req.body.email});
      const comparePassword = await bcrypt.compare(value, candidate.password);

      if (!comparePassword) {
        return Promise.reject('User with this password not exists');
      }

    } catch (e) {
      console.log(e)
    }
  })
]


exports.registerValidator = [
  body('email')
  .isEmail().withMessage('Input correct email')
  .custom(async (value, {req}) => {
    try {
      const user = await User.findOne({email: value})
      if (user) {
        return Promise.reject('User with this email already exists')
      }
    } catch (e) {
      console.log(e)
    }
  })
  .normalizeEmail({gmail_remove_dots: false}),
  body('password', 'Password must be at least 6 characters')
  .isLength({min: 6, max: 20})
  .isAlphanumeric()
  .trim(),
  body('confirm')
  .custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password must match')
    }
    return true
  })
  .trim(),
  body('name')
  .isLength({min: 3})
  .withMessage('Name must be at least 3 characters')
  .trim()
]

exports.passwordValidator = [
  body('password', 'Password must be at least 6 characters')
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim()
]


exports.trackValidator = [
  body('name').isLength({min: 3}).withMessage('Track title must be at least 3 characters').trim(),
  body('artist').isLength({min: 3}).withMessage('Artist name must be at least 3 characters').trim(),
  body('description', 'Input your description').isLength({min: 10}).withMessage('Description must be at least 10 characters'),
  body('img')
  .custom((value, {req}) => {
    if (!req.files['img']) {
      throw new Error('Input an image');
    } 
      return true;
  }),
  body('audio')
  .custom((value, {req}) => {
    if (!req.files['audio']) {
      throw new Error('Input an audio');
    }
      return true;
  })
]