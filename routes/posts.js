const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, postController.createPost);
router.get('/', authenticate, postController.getAllPosts);
router.get('/user/:user_id', authenticate, postController.getPostsByUser);
router.delete('/:post_id', authenticate, postController.deletePost);

module.exports = router;