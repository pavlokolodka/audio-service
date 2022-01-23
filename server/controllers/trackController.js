const Track = require('../models/track')


exports.getAll = async (req, res) => {
  try {
    const tracks = await Track.find().select('name artist img audio listens')
    res.render('tracks', {
      title: 'Tracks',
      tracks
    });
  } catch (e) {
    console.log(e);
  }
}



exports.getOne = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
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



exports.create = async (req, res) => {
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
    res.json(deletedTrack);
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

