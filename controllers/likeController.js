const db = require('../models/db');

exports.getLikesCount = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.user.user_id; // ✅ from JWT

  try {
    const countResult = await db.query(
      'SELECT COUNT(*) AS likes FROM Likes WHERE post_id = $1',
      [post_id]
    );

    const likedResult = await db.query(
      'SELECT 1 FROM Likes WHERE post_id = $1 AND user_id = $2',
      [post_id, user_id]
    );

    res.status(200).json({
      likeCount: parseInt(countResult.rows[0].likes, 10),
      userLiked: likedResult.rows.length > 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.toggleLike = async (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.user_id; // ✅ from JWT

  try {
    const existing = await db.query(
      'SELECT * FROM Likes WHERE post_id = $1 AND user_id = $2',
      [post_id, user_id]
    );

    let liked;
    if (existing.rows.length > 0) {
      await db.query(
        'DELETE FROM Likes WHERE post_id = $1 AND user_id = $2',
        [post_id, user_id]
      );
      liked = false;
    } else {
      await db.query(
        'INSERT INTO Likes (post_id, user_id) VALUES ($1, $2)',
        [post_id, user_id]
      );
      liked = true;
    }

    const countResult = await db.query(
      'SELECT COUNT(*) AS likes FROM Likes WHERE post_id = $1',
      [post_id]
    );

    res.status(200).json({
      liked,
      likeCount: parseInt(countResult.rows[0].likes, 10)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
