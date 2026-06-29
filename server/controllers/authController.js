const Admin = require('../models/Admin');
const { generateToken } = require('../utils/token');

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const setAuthCookie = (res, token) => {
  const cookieName = process.env.COOKIE_NAME || 'sc_token';
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (admin.isLocked()) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${minutesLeft} minute(s)`,
      });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= MAX_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        admin.loginAttempts = 0;
      }
      await admin.save();
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    const token = generateToken({ id: admin._id.toString(), role: admin.role });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res) => {
  const cookieName = process.env.COOKIE_NAME || 'sc_token';
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

const resetAdminPassword = async (req, res, next) => {
  try {
    const { secret, email, newPassword } = req.body;

    if (!process.env.RESET_SECRET || secret !== process.env.RESET_SECRET) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!email || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Email and a password of at least 8 characters are required',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found with this email' });
    }

    admin.password = newPassword;
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    return res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    next(err);
  }
};
