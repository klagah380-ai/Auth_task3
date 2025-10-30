const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verify error:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
