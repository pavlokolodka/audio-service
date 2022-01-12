const Track = require('../models/track')


exports.getAll = async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (e) {
    console.log(e);
  }
}



exports.getOne = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    res.json(track);  
  } catch (e) {
    console.log(e);
  }
}



exports.create = async (req, res) => {
  const track = new Track({
    name: req.body.name,
    artist: req.body.artist,
    description: req.body.description,
    img: req.body.img,
    audio: req.body.audio
  })

  try {
    const saveTrack = await track.save();
    res.json(saveTrack)
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

