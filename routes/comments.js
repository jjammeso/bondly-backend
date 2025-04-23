const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.addComment);
router.get('/:post_id', commentController.getCommentsForPost);

module.exports = router;
