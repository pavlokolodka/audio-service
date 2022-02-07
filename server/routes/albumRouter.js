const {Router} = require('express');
const router = Router();
const albumController = require('../controllers/albumController');
const authMiddleware = require('../middleware/auth');


router.get('/', authMiddleware, albumController.getPage);


router.post('/:id/add', authMiddleware, albumController.add);


router.delete('/:id/delete', authMiddleware, albumController.delete);


module.exports = router;