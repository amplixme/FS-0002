import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// ÚLTIMO middleware: manejo centralizado de errores
app.use(errorHandler);

export default app;