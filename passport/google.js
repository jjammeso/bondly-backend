const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models/db');
const jwt = require('jsonwebtoken');

const GOOGLE_CLIENT_ID = 'your-client-id';
const GOOGLE_CLIENT_SECRET = 'your-secret';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  const google_id = profile.id;
  const email = profile.emails[0].value;
  const username = profile.displayName;

  const findOrCreate = `
    INSERT INTO Users (username, email, google_id)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET google_id = EXCLUDED.google_id
  `;

  db.query(findOrCreate, [username, email, google_id], (err) => {
    if (err) return done(err);
    done(null, { user_id: google_id, username });
  });
}));
