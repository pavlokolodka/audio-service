const {model, Schema} = require('mongoose')


const trackSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
     type: String,
     required: true
   },
  description: String,
  img: String,
  audio: {
    type: String,
    required: true  
  },
  listens: {
     type: Number,
     default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  } 
})


module.exports = model('Track', trackSchema)