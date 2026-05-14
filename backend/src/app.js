import "dotenv/config"
import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";


const app = express();

// middlewares globales
app.use(cors());
app.use(express.json());

// Verificar conexión a la DB
prisma.$connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error conectando a PostgreSQL", err));

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;