export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      const errorDetails = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        error: {
          message: "Error de validación en los datos enviados",
          details: errorDetails,
        },
      });
    }
  };
};
