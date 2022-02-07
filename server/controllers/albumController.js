const Track = require('../models/track');
const User = require('../models/user');
const albumService = require('../services/albumService');



exports.getPage = async (req, res) => {
  try {
    const user = await req.user.populate('album.trackId');
    const album = user.album;

    const tracks = albumService.mapAlbum(album);
    
    res.render('album', {
      title: 'Album',
      tracks: tracks
    })
  } catch (e) {
    console.log(e);
  }
}


exports.add = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
  
    await albumService.addToAlbum(req, res, track);
  } catch (e) {
    console.log(e);
  }
}


exports.delete = async (req, res) => {
  try {
    const sessionUser = await req.user;
    await User.updateOne({_id: sessionUser._id}, { $pull: { 'album': {trackId: req.params.id} } });
    const updateUser = await User.findById(req.user._id)
    
    req.session.user = updateUser;
    req.session.save(err => {
      if (err) {
        throw err
      }
      res.redirect('/album')
    });
  } catch (e) {
    console.log(e);
  }
}