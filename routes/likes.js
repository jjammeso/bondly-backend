const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticate = require('../middleware/authMiddleware');


router.post('/', authenticate, likeController.toggleLike);
router.get('/:post_id', authenticate, likeController.getLikesCount);

module.exports = router;
