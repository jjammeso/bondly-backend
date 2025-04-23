const db = require('../models/db');

// Create a post
exports.createPost = async (req, res) => {
  const { user_id, content } = req.body;
  const sql = 'INSERT INTO Posts (user_id, content) VALUES ($1, $2) RETURNING post_id';

  try {
    const result = await db.query(sql, [user_id, content]);
    res.status(201).json({ message: 'Post created', postId: result.rows[0].post_id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  const sql = `
    SELECT p.post_id, p.content, u.username, p.created_at
    FROM Posts p
    JOIN Users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
  `;

  try {
    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
