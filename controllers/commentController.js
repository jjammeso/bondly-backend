const db = require('../models/db');

// Add a comment to a post
exports.addComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;
  const sql = 'INSERT INTO Comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING comment_id';

  try {
    const result = await db.query(sql, [post_id, user_id, content]);
    res.status(201).json({ message: 'Comment added', commentId: result.rows[0].comment_id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all comments for a post
exports.getCommentsForPost = async (req, res) => {
  const post_id = req.params.post_id;
  const sql = `
    SELECT c.comment_id, c.content, u.username, c.created_at, c.user_id
    FROM Comments c
    JOIN Users u ON c.user_id = u.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `;

  try {
    const result = await db.query(sql, [post_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a comment (only if the logged-in user is the owner)
exports.deleteComment = async (req, res) => {
  const comment_id = req.params.comment_id;
  const loggedInUserId = req.user?.user_id; 

  if (!loggedInUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const fetchCommentSql = 'SELECT user_id FROM Comments WHERE comment_id = $1';
  const deleteCommentSql = 'DELETE FROM Comments WHERE comment_id = $1';

  try {
    const result = await db.query(fetchCommentSql, [comment_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const commentOwnerId = result.rows[0].user_id;

    if (parseInt(commentOwnerId) !== loggedInUserId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
    }

    await db.query(deleteCommentSql, [comment_id]);
    res.status(200).json({ message: 'Comment deleted' });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};