const db = require('../models/db');

// Like a post
exports.likePost = async (req, res) => {
  const { post_id, user_id } = req.body;
  const sql = 'INSERT INTO Likes (post_id, user_id) VALUES ($1, $2)';

  try {
    await db.query(sql, [post_id, user_id]);
    res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique_violation
      return res.status(409).json({ message: 'Already liked' });
    }
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  const { post_id, user_id } = req.body;
  const sql = 'DELETE FROM Likes WHERE post_id = $1 AND user_id = $2';

  try {
    await db.query(sql, [post_id, user_id]);
    res.status(200).json({ message: 'Post unliked' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get likes count for a post
exports.getLikesCount = async (req, res) => {
  const post_id = req.params.post_id;
  const sql = 'SELECT COUNT(*) AS likes FROM Likes WHERE post_id = $1';

  try {
    const result = await db.query(sql, [post_id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
