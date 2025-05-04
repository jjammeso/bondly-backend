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


// Get all posts by a specific user
exports.getPostsByUser = async (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT p.post_id, p.content, u.username, p.created_at
    FROM Posts p
    JOIN Users u ON p.user_id = u.user_id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
  `;

  try {
    const result = await db.query(sql, [user_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  const { post_id } = req.params;
    const userId = req.user.user_id; // assume your JWT contains user_id

    try {
        // Check if the post exists and belongs to the logged-in user
        const post = await db.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);

        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own posts' });
        }

        // Delete the post
        await db.query('DELETE FROM posts WHERE post_id = $1', [post_id]);

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error' });
    }
}
