const errorHandler = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: {
        message: "El archivo supera el tamaño máximo de 5MB",
        status: 400,
      },
    });
  }

  if (err.message === "Formato de imagen no permitido") {
    return res.status(400).json({
      error: {
        message: "Formato de imagen no permitido. Solo se aceptan jpg, png y webp",
        status: 400,
      },
    });
  }
  
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
