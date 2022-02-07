const User = require('../models/user');


exports.addToAlbum = async (req, res, track) => {
  const sessionUser = await req.user;
  const user = await User.findById(sessionUser._id);

  const index = user.album.findIndex(i => {
    return i.trackId.toString() === track._id.toString();
  }) 

  if (index >= 0) {
    req.flash('albumError', 'Track already added');
    return res.redirect('/tracks');
  }
  
  user.album.push({trackId: track._id});
  await user.save();
  req.session.user = user;
  req.session.save(err => {
    if (err) {
      throw err
    }
    res.redirect('/tracks')
  });
}



exports.mapAlbum = (album) => {
  return album.map(t => ({
    _id: t.trackId._id,
    name: t.trackId.name,
    artist: t.trackId.artist,
    description: t.trackId.description,
    img: t.trackId.img,
    audio: t.trackId.audio,
    listens: t.trackId.listens, 
    date: t.date.toLocaleDateString()
    }));
}