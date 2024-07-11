const authorize = (userType) => {
    return (req, res, next) => {
      if (req.user.userType !== userType) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      next();
    };
  };
  
  module.exports = authorize;
  