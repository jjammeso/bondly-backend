const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models/db');
const jwt = require('jsonwebtoken');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://srv727548.hstgr.cloud/app3/api/googleAuth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const google_id = profile.id;
  const email = profile.emails[0].value;
  const username = profile.displayName;

  try {
    // Insert or update the user
    const query = `
      INSERT INTO Users (username, email, google_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET google_id = EXCLUDED.google_id
      RETURNING user_id, username
    `;
    const result = await db.query(query, [username, email, google_id]);

    const user = result.rows[0];
    done(null, user);  // Now user has user_id and username from your DB
  } catch (err) {
    console.error('Google OAuth error:', err);
    done(err, null);
  }
}));
