const albumService = require('../services/albumService');
const trackService = require('../services/trackService');



exports.getPage = async (req, res) => {
  try {
    const album = await albumService.getUserAlbum(req);

    const tracks = await albumService.mapAlbum(req, album);
   
    res.render('album', {
      title: 'Album',
      userId: req.user ? req.user._id.toString() : null,
      tracks: tracks
    })
  } catch (e) {
    console.log(e);
  }
}


exports.add = async (req, res) => {
  try {
    const track = await trackService.findTrack(req)
  
    await albumService.addToAlbum(req, res, track);
  } catch (e) {
    console.log(e);
  }
}


exports.delete = async (req, res) => {
  try {
    await albumService.removeFromAlbum(req, res);
  } catch (e) {
    console.log(e);
  }
}