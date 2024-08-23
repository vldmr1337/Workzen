const authorize = (requiredRole) => {
  return (req, res, next) => {
    const { userType, isAdmin } = req.user;

    if (requiredRole === 'admin' && !isAdmin) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (requiredRole !== 'admin' && userType !== requiredRole) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
};

module.exports = authorize;
