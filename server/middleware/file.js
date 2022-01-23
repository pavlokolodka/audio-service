const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'img') {
      cb(null, path.join('./public', 'images'));
    } else {
      cb(null, path.join('./public', 'audio'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const allowableImg = ['image/png', 'image/jpeg', 'image/jpg'];
const allowableAudio = ['audio/ogg', 'audio/mpeg'];
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'img') {
    if (allowableImg.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    if (allowableAudio.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}

 

module.exports = multer({
  storage, fileFilter
}) 