const User = require('../models/user');


exports.addToAlbum = async (req, res, track) => {
  const user = await req.user;
  
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


exports.getUserAlbum = async (req) => {
  const user = await req.user.populate('album.trackId');
  return user.album;
}


exports.mapAlbum = async (req, album) => {
 //Validation for remote tracks
  for (let i = 0; i < album.length; i++) {
    if (album[i].trackId === null) {
      console.log('yea')
      delete album[i];
    }
  }
  
  const filterAlbum = album.filter((el) => {
    return el !== null && typeof el !== 'undefined';
  });

  const user = await req.user;
  user.album = filterAlbum;
  await user.save()
  req.session.user = user;
  req.session.save();

  return filterAlbum.map(t => ({
    _id: t.trackId._id,
    name: t.trackId.name,
    artist: t.trackId.artist,
    description: t.trackId.description,
    img: t.trackId.img,
    audio: t.trackId.audio,
    listens: t.trackId.listens, 
    userId: t.trackId.userId,
    date: t.date.toLocaleDateString()
    }));
}


exports.removeFromAlbum = async (req, res) => {
  try {
    const user = await req.user;
    await User.updateOne({_id: user._id}, { $pull: { 'album': {trackId: req.params.id} } });
    const updateUser = await User.findById(user._id);

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