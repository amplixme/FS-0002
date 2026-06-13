import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import router from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();


app.use(cors({
  origin: (origin, callback) => {
    const corsOrigin = process.env.CORS_ORIGIN;
    
    if (corsOrigin) {
      return callback(null, origin === corsOrigin);
    }
    
    if (!origin || origin.startsWith("http://localhost")) {
      return callback(null, true);
    }
    
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json());

prisma
  .$connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error conectando a PostgreSQL", err));

// routes
app.use("/api", router);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.use(errorHandler);

export default app;
