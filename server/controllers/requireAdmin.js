const requireAdmin = (req, res, next) => {
  console.log("🔐 Inside requireAdmin | User:", req.user);

  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};


module.exports = requireAdmin;
