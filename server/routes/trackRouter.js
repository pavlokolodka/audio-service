const {Router} = require('express')
const router = Router()
const trackController = require('../controllers/trackController')



router.get('/', trackController.getAll);


router.get('/:id', trackController.getOne)


router.get('/search', trackController.search)


router.delete('/:id', trackController.delete)


router.post('/listen/:id', trackController.listen)



module.exports = router