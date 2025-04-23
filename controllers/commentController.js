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
    SELECT c.comment_id, c.content, u.username, c.created_at
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
