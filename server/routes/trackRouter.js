const {Router} = require('express')
const router = Router()
const trackController = require('../controllers/trackController')
const Track = require('../models/track')

// !add pagination - https://youtu.be/A0CfYSVzAZI?t=2989
router.get('/', trackController.getAll);


router.get('/:id', trackController.getOne)


router.post('/', trackController.create)


router.get('/search', trackController.search)


router.delete('/:id', trackController.delete)

// **maybe take over to get by id?
// !when track listen is over, request this route
router.post('/listen/:id', trackController.listen)


module.exports = router