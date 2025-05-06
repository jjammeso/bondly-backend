const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const auth = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors({
    origin:'https://bondly-chi.vercel.app',
    credentials: true,
}));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/googleAuth', googleAuthRoutes);

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.get('/', (req,res) => {
  res.send('server is running');
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
