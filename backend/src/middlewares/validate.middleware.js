export const validateBody = (schema) => {
  return (req, res, next) => {
    const plainBody = { ...req.body };
    

    const result = schema.safeParse(plainBody);
    

    if (result.success) {
      req.body = result.data;
      return next();
    }

    const errorDetails = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      error: {
        message: "Error de validación en los datos enviados",
        details: errorDetails,
      },
    });
  };
};
