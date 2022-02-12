const trackService = require('../services/trackService');
const {validationResult} = require('express-validator');


function isOwner(track, req) {
  return track.userId.toString() === req.user._id.toString()
}

exports.getAll = async (req, res) => {
  try {
    const tracks = await trackService.findTracks();
    
    res.render('tracks', {
      title: 'Tracks',
      albumError: req.flash('albumError'),
      userId: req.user ? req.user._id.toString() : null,
      tracks
    });
    
  } catch (e) {
    console.log(e);
  }
}



exports.getOne = async (req, res) => {
  try {
    const isValidId = trackService.isValidObjectId(req.params.id);

    if (!isValidId) {
      res.status(404).render('404', {
        title: 'Page not found',
        layout: 'empty',
        link: process.env.SITE_URL
      })
    }

    const track = await trackService.findTrack(req);
    
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
    const track = await trackService.findTrack(req);

    if (!isOwner(track, req)) {
      return res.redirect('/tracks')
    }

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
  try {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add track',
      addError: errors.array()[0].msg,
      data: {
        name: req.body.name,
        artist: req.body.artist,
        description: req.body.description,
        userId: req.user._id
      }
    })
  } 

  await trackService.saveTrack(req);

  res.redirect('/tracks')
  } catch (e) {
    console.log(e);
  }
}



exports.search = async (req, res) => {
  try {
    const searchValue = req.query.search;
   
    if (searchValue === ' ') {
      req.flash('albumError', 'Value must not be empty')
      return res.redirect('/tracks');
    }
    
    const tracks = await trackService.searchTrack(req);

    if (tracks.length === 0) {
      req.flash('albumError', 'Track not found...')
    }

    return res.render('search-tracks', {
      title: 'Tracks',
      albumError: req.flash('albumError'),
      tracks
    })
    
  } catch (e) {
    console.log(e);
  }
}



exports.delete = async (req, res) => {
  try {
    const track = await trackService.findTrack(req);

    if (!isOwner(track, req)) {
      return res.redirect('/tracks')
    }
    
    await trackService.deleteTrack(req);
    res.redirect('/tracks');
  } catch (e) {
    console.log(e);
  }
}



exports.update = async (req, res) => {
try {
  const errors = validationResult(req);
  const id = req.params.id;

  if (!errors.isEmpty()) {
    req.flash('editError', errors.array()[0].msg)
    return res.status(422).redirect(`/tracks/${id}/edit`)
  }  
  
  await trackService.updateTrack(req);

  res.redirect('/tracks');
  } catch (e) {
    console.log(e);
  }
}



exports.listen = async (req, res) => {
  try {
    await trackService.addListens(req);
  } catch (e) {
    console.log(e);
  }
}

