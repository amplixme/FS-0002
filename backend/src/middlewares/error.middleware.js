const errorHandler = (err, req, res, next) => {
  // Errores de validación de Prisma
  if (err.code === "P2002") {
    return res.status(409).json({
      error: {
        message: "Ya existe un registro con ese valor único",
        status: 409,
      },
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: {
        message: "Registro no encontrado",
        status: 404,
      },
    });
  }

  // Error genérico
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  

  return res.status(status).json({
    error: {
      message,
      status,
    },
  });
};

export default errorHandler;