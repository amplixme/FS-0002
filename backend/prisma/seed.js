// Importamos cliente que nos permite comunicarnos con la BD
import { PrismaClient } from "../src/generated/prisma/index.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  console.log("🌱 Iniciando el proceso de seed...");

  // 1. Limpiar datos anteriores (en orden inverso a las dependencias para no romper llaves foráneas)

  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Base de datos (Posts, Comments, Users) limpiada.");

  // 2. Definición de las 5 categorías originales (Criterio de aceptación)
  const categoriesData = [
    { name: "Tecnología", slug: "tecnologia" },
    { name: "Diseño", slug: "diseno" },
    { name: "Programación", slug: "programacion" },
    { name: "DevOps", slug: "devops" },
    { name: "Opinión", slug: "opinion" },
  ];

  // Guardamos las categorías creadas en un diccionario para conectarlas a los posts luego
  const createdCategories = {};
  for (const category of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories[category.slug] = cat;
  }
  console.log("🏷️ Categorías listas.");

  // 3. Crear Usuarios
  const hashedPassword = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Amplix",
      email: "admin@amplix.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Santiago Molina",
      email: "santiago@demo.com",
      password: hashedPassword,
      role: "USER",
    },
  });
  console.log("👥 Usuarios creados.");

  // 4. Crear Posts
  const post1 = await prisma.post.create({
    data: {
      title: "Arquitectura MERN para EMUNA: Catálogo de plantas y artesanías",
      content:
        "Al desarrollar EMUNA, decidí centrarme exclusivamente en el stack MERN para dominarlo y ser competitivo. En este post detallo cómo integré Cloudinary para la gestión de imágenes de las plantas y cómo estructuré el backend para el control de stock.",
      published: true,
      authorId: admin.id,
      categories: {
        connect: [
          { id: createdCategories["tecnologia"].id },
          { id: createdCategories["programacion"].id },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Tips para afrontar entrevistas técnicas en inglés",
      content:
        "La fluidez en inglés es clave para los desarrolladores de software hoy en día. Recomiendo practicar simulaciones de entrevistas, usar plataformas de intercambio de idiomas y no tener miedo a equivocarse mientras se explica código en voz alta.",
      published: true,
      authorId: user.id,
      categories: {
        connect: [{ id: createdCategories["opinion"].id }],
      },
    },
  });
  console.log("📝 Posts creados.");

  // 5. Crear Comentarios
  await prisma.comment.create({
    data: {
      content:
        "¡Excelente artículo! La integración de Cloudinary siempre es un desafío la primera vez.",
      authorId: user.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "Totalmente de acuerdo, la práctica constante es la única forma de soltar la lengua en las entrevistas.",
      authorId: admin.id,
      postId: post2.id,
    },
  });
  console.log("💬 Comentarios creados.");

  console.log("✅ Seed completado con éxito. ¡Listo para la demo!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
