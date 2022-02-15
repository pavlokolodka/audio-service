const ObjectId = require('mongoose').Types.ObjectId;
const Track = require('../models/track');
const trackService = require('../services/trackService');

exports.findTracks = async () => {
  return await Track.find().select('name artist img audio listens').populate('userId');
}


exports.findTrack = async (req) => {
  return await await Track.findById(req.params.id);
}


exports.saveTrack = async (req) => {
  const audioPath = req.files['audio'][0].path;
  const imgPath = req.files['img'][0].path;

  const track = new Track({
    name: req.body.name,
    artist: req.body.artist,
    description: req.body.description,
    img: imgPath,
    audio: audioPath,
    userId: req.user._id
  })

  await track.save();
}


exports.searchTrack = async (req) => {
  const searchValue = req.query.search;
  return await Track.find({ $or: [ { name: {$regex: `${searchValue}`, $options: 'i' }} , { artist: {$regex: `${searchValue}`, $options: 'i' }} ] } );
}


exports.deleteTrack = async (req) => {
  return await Track.deleteOne({_id: req.params.id});
}


exports.updateTrack = async (req) => {
  const audioPath = req.files['audio'][0].path;
  const imgPath = req.files['img'][0].path;

  await Track.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    artist: req.body.artist,
    description: req.body.description,
    img: imgPath,
    audio: audioPath
  });
}


exports.addListens = async (req) => {
  const track = await trackService.findTrack(req);
  track.listens += 1;
  await track.save()
}


exports.isValidObjectId = (id) => {
  if(ObjectId.isValid(id)) {
    if((String)(new ObjectId(id)) === id)
        return true;
    return false;
  }
return false;
}
