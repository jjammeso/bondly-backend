const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/', likeController.likePost);
router.delete('/', likeController.unlikePost);
router.get('/:post_id', likeController.getLikesCount);

module.exports = router;
