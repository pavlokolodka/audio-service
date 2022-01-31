const {model, Schema} = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
     type: String,
     unique: true,
     required: true
   },
  password: {
    type: String,
    required: true
  },
  album: [{
    trackId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  resetToken: String
})


module.exports = model('User', userSchema);