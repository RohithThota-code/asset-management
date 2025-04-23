const User = require("../models/user");
const { hashP, compareP } = require('../bcrypt/auth');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || password.length < 8) {
      return res.json({ error: "Invalid registration fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ error: "You already have an account" });

    const hashedP = await hashP(password);
    const user = await User.create({
      username,
      email,
      password: hashedP,
      role: "employee", // default role
      canUpdate: true
    });

    res.json({
      message: "User registered successfully",
      user: { username: user.username, id: user._id, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: 'You do not have an account' });

    const match = await compareP(password, user.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const sessionId = uuidv4();
    const loginTime = new Date();
    user.sessions.push({ sessionId, loginTime });
    await user.save();

    jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user._id,
        role: user.role,             // ✅ include role
        canUpdate: user.canUpdate,   // ✅ include permission flag
        loginTime: loginTime.toISOString(),
        sessionId
      },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) return res.json({ error: "Token generation failed" });

        res.cookie('token', token, {
          httpOnly: true,
          secure: false,              // ❗ Must be false for localhost
          sameSite: 'lax',            // ✅ 'lax' allows POST with credentials from different origin
          maxAge: 3600000,
          path: '/'
        });
        
        res.json({
          message: "Login successful",
          user: {
            id: user._id,
            email: user.email,
            role: user.role,             // ✅ Required for frontend redirection
            canUpdate: user.canUpdate    // 🔄 Optional, if used in UI
          }
          
        });
        console.log("User role:", req.user.role);

      }
    );
  } catch (error) {
    
    console.error(error);
    res.json({ error: "Login failed" });
  }
};

const logoutUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).json({ error: "No token found" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const session = user.sessions.find(s => s.sessionId === decoded.sessionId);
    if (session) {
      session.logoutTime = new Date();
      await user.save();
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.json({ message: "Logged out successfully" });
  });
};

const authenticateToken = (req, res, next) => {
  console.log("🔐 Cookies received:", req.cookies);
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });

    req.user = decoded;
    next();
  });
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const currentSession = user.sessions.find(s => s.sessionId === req.user.sessionId);

    if (!currentSession || currentSession.logoutTime) {
      return res.status(401).json({ error: "Session expired or not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      canUpdate: user.canUpdate,
      currentSession: {
        sessionId: currentSession.sessionId,
        loginTime: currentSession.loginTime
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  authenticateToken
};


