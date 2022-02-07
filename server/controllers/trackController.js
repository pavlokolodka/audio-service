const Track = require('../models/track');
const {isValidObjectId} = require('../services/trackService');
const {validationResult} = require('express-validator');


exports.getAll = async (req, res) => {
  try {
    const tracks = await Track.find().select('name artist img audio listens')
    res.render('tracks', {
      title: 'Tracks',
      albumError: req.flash('albumError'),
      tracks
    });
  } catch (e) {
    console.log(e);
  }
}



exports.getOne = async (req, res) => {
  try {
    const isValidId = isValidObjectId(req.params.id);

    if (!isValidId) {
      res.status(404).render('404', {
        title: 'Page not found',
        layout: 'empty',
        link: process.env.SITE_URL
      })
    }

    const track = await Track.findById(req.params.id);
    
    if (!track) {
      res.status(404).render('404', {
        title: 'Page not found',
        layout: 'empty',
        link: process.env.SITE_URL
      })
    }
    
    res.render('track', {
      layout: 'empty',
      title: `${track.name}`,
      track
    });  
  } catch (e) {
    console.log(e);
  }
}



exports.getAddPage = (req, res) => {
  try {
    res.render('add', {
      title: 'Add track'
    });
  } catch(e) {
    console.log(e);
  }
  
}



exports.getEdit = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    res.render('track-edit', {
      title: `Edit ${track.name}`,
      editError: req.flash('editError'),
      track
    })
  } catch (e) {
    console.log(e);
  }
}



exports.create = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add track',
      addError: errors.array()[0].msg,
      data: {
        name: req.body.name,
        artist: req.body.artist,
        description: req.body.description
      }
    })
  } 

  
  const audioPath = req.files['audio'][0].path;
  const imgPath = req.files['img'][0].path;

  const track = new Track({
    name: req.body.name,
    artist: req.body.artist,
    description: req.body.description,
    img: imgPath,
    audio: audioPath
  })

  try {
    await track.save();
    res.redirect('/tracks')
  } catch (e) {
    console.log(e);
  }
}



exports.search = async (req, res) => {
  try {
    const track = await Track.find({
      name: {$regex: new RegExp(req.params.name)}
    });
    res.json(track);
  } catch (e) {
    console.log(e);
  }
}



exports.delete = async (req, res) => {
  try {
    const deletedTrack = await Track.deleteOne({_id: req.params.id});
    res.redirect('/tracks');
  } catch (e) {
    console.log(e);
  }
}



exports.update = async (req, res) => {
  const errors = validationResult(req);
  const id = req.params.id;

  if (!errors.isEmpty()) {
    req.flash('editError', errors.array()[0].msg)
    return res.status(422).redirect(`/tracks/${id}/edit`)
  }  
  
  const audioPath = req.files['audio'][0].path;
  const imgPath = req.files['img'][0].path;
  try {
    await Track.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      artist: req.body.artist,
      description: req.body.description,
      img: imgPath,
      audio: audioPath
    });
    res.redirect('/tracks');
  } catch (e) {
    console.log(e);
  }
}



exports.listen = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    track.listens += 1;
    await track.save()
  } catch (e) {
    console.log(e);
  }
}

