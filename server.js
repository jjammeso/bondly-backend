const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const auth = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/auth', googleAuthRoutes);

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
