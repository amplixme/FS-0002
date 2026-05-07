export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: "No autenticado" } });
    
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error: { message: "No tenes permiso para acceder a esta acción" },
        });
    }
    
    next();
  };
};
