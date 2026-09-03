const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },   // payload: what's encoded inside the token
    process.env.JWT_SECRET,               // secret key used to sign it
    { expiresIn: '7d' }                   // token becomes invalid after 7 days
  );
}

module.exports = generateToken;