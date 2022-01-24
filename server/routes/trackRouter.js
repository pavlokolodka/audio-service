const {Router} = require('express')
const router = Router()
const trackController = require('../controllers/trackController')



router.get('/', trackController.getAll);


router.get('/add', trackController.getAddPage);


router.get('/:id', trackController.getOne);


router.get('/search', trackController.search);


router.get('/:id/edit', trackController.getEdit);


router.delete('/:id/delete', trackController.delete);


router.put('/:id/update', trackController.update);


router.post('/listen/:id', trackController.listen);


router.post('/create', trackController.create);



module.exports = router