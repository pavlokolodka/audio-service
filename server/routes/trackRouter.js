const {Router} = require('express');
const router = Router();
const trackController = require('../controllers/trackController');
const authMiddleware = require('../middleware/auth');
const {trackValidator} = require('../middleware/validator');


router.get('/', trackController.getAll);


router.get('/add', authMiddleware, trackController.getAddPage);


router.get('/:id', authMiddleware, trackController.getOne);


router.get('/search', authMiddleware, trackController.search);


router.get('/:id/edit', authMiddleware, trackController.getEdit);


router.delete('/:id/delete', authMiddleware, trackController.delete);


router.put('/:id/update', authMiddleware, trackValidator, trackController.update);


router.post('/listen/:id', authMiddleware, trackController.listen);


router.post('/create', authMiddleware, trackValidator, trackController.create);



module.exports = router