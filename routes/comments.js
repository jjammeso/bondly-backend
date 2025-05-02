const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');


router.post('/', authenticate, commentController.addComment);
router.get('/:post_id', commentController.getCommentsForPost);
router.delete('/:comment_id', authenticate, commentController.deleteComment);

module.exports = router;
