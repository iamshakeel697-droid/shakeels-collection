const { verifyToken } = require('../utils/token');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'sc_token';
    let token = req.cookies?.[cookieName];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
    }

    req.admin = { id: admin._id.toString(), email: admin.email, role: admin.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
