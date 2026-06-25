import { PrismaClient } from "../src/generated/prisma/index.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const categoriesData = [
    { name: "Tecnología", slug: "tecnologia" },
    { name: "Diseño", slug: "diseno" },
    { name: "Programación", slug: "programacion" },
    { name: "DevOps", slug: "devops" },
    { name: "Opinión", slug: "opinion" },
  ];

  const createdCategories = {};
  for (const category of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories[category.slug] = cat;
  }

  const hashedPassword = await bcrypt.hash("123456", 10);
  const allUsers = [];

  // ADMIN
  allUsers.push(
    await prisma.user.create({
      data: {
        name: "Admin Amplix",
        email: "admin@amplix.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    })
  );

  // COLLABORATOR de prueba
  allUsers.push(
    await prisma.user.create({
      data: {
        name: "Colaborador Demo",
        email: "colaborador@demo.com",
        password: hashedPassword,
        role: "COLLABORATOR",
      },
    })
  );

  const teamNames = ["Angel Berretta", "Thomas Brets", "Jorge Agustin Aparicio R."];
  for (const name of teamNames) {
    const emailPrefix = name
      .split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const email = `${emailPrefix}@demo.com`;

    allUsers.push(
      await prisma.user.create({
        data: { name, email, password: hashedPassword, role: "USER" },
      })
    );
  }

  // Posts publicados
  const postsData = [
    { title: "Arquitectura MERN para proyectos escalables", cat: "programacion" },
    { title: "Tips para afrontar entrevistas técnicas en inglés", cat: "opinion" },
    { title: "El futuro de React 19 y sus nuevos hooks", cat: "tecnologia" },
    { title: "¿Por qué usar TailwindCSS en 2026?", cat: "diseno" },
    { title: "Guía definitiva de Prisma ORM para principiantes", cat: "programacion" },
    { title: "Cómo optimizar tu perfil de LinkedIn como Dev", cat: "opinion" },
    { title: "Despliegue en la nube con Render paso a paso", cat: "devops" },
    { title: "Diseño UX/UI para desarrolladores Frontend", cat: "diseno" },
    { title: "JWT vs Cookies: ¿Cuál usar para autenticación?", cat: "tecnologia" },
    { title: "De Junior a Semi-Senior: Mi experiencia real", cat: "opinion" },
    { title: "Patrones de diseño esenciales en Node.js", cat: "programacion" },
    { title: "Configurando Vitest para tests unitarios", cat: "devops" },
    { title: "Accesibilidad web: Mucho más que el alt text", cat: "diseno" },
    { title: "CI/CD pipelines básicos con GitHub Actions", cat: "devops" },
    { title: "Sobreviviendo al síndrome del impostor en IT", cat: "opinion" },
  ];

  const createdPosts = [];
  for (let i = 0; i < postsData.length; i++) {
    const data = postsData[i];
    const author = allUsers[i % allUsers.length];

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: `Este es un artículo detallado sobre ${data.title}. En el mundo del desarrollo de software, mantenernos actualizados y aplicar buenas prácticas es esencial para crear productos de alta calidad y mantenernos competitivos en el mercado. Aquí exploramos los conceptos fundamentales, herramientas recomendadas y consejos prácticos para dominar esta área.`,
        coverImage: `https://picsum.photos/seed/post-${i}/800/450`,
        published: true,
        authorId: author.id,
        categories: { connect: [{ id: createdCategories[data.cat].id }] },
      },
    });
    createdPosts.push(post);
  }

  // ── Borradores pendientes de USER (para probar el panel de colaboración) ──
  const userAccounts = allUsers.filter((u, idx) => idx >= 2); // solo los USER
  const draftPostsData = [
    {
      title: "Mi experiencia aprendiendo TypeScript desde cero",
      cat: "programacion",
      content:
        "Empecé a aprender TypeScript hace tres meses y la curva de aprendizaje fue interesante. Al principio los tipos me parecían una molestia, pero después de unas semanas noté cómo me ahorraban bugs en tiempo de compilación. En este artículo cuento mis tips y los recursos que más me ayudaron para hacer la transición desde JavaScript puro.",
    },
    {
      title: "Cómo organizo mi tiempo como desarrollador freelance",
      cat: "opinion",
      content:
        "Trabajar de manera independiente tiene sus ventajas y sus desafíos. La libertad de horario puede convertirse en una trampa si no tenés una rutina clara. Te cuento las herramientas que uso, cómo gestiono mis proyectos y qué aprendí a lo largo de dos años trabajando sin jefe.",
    },
    {
      title: "Introducción a Docker para desarrolladores web",
      cat: "devops",
      content:
        "Docker cambió completamente cómo trabajo en equipo. Ya no hay más el clásico 'en mi máquina funciona'. En este artículo te explico los conceptos básicos: imágenes, contenedores, volúmenes y docker-compose, con ejemplos prácticos para una app Node.js + PostgreSQL.",
    },
  ];

  for (let i = 0; i < draftPostsData.length; i++) {
    const data = draftPostsData[i];
    const author = userAccounts[i % userAccounts.length];

    await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: false, // borrador pendiente de revisión
        authorId: author.id,
        categories: { connect: [{ id: createdCategories[data.cat].id }] },
      },
    });
  }

  // Comentarios en posts publicados
  const commentTexts = [
    "¡Excelente artículo! Me sirvió muchísimo.",
    "Tenía esta duda hace semanas, gracias por aclararlo.",
    "Muy buena redacción, ¿para cuándo la segunda parte?",
    "Totalmente de acuerdo con tu punto de vista.",
    "Implementé esto en mi proyecto y funciona de diez.",
  ];

  for (const post of createdPosts) {
    for (let j = 0; j < 2; j++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      await prisma.comment.create({
        data: { content: randomText, authorId: randomUser.id, postId: post.id },
      });
    }
  }

  console.log("✅ Seed completado:");
  console.log(`   - ${allUsers.length} usuarios (1 ADMIN, 1 COLLABORATOR, ${teamNames.length} USER)`);
  console.log(`   - ${createdPosts.length} posts publicados`);
  console.log(`   - ${draftPostsData.length} borradores pendientes de USER`);
  console.log(`   - ${createdPosts.length * 2} comentarios`);
  console.log("\n   Credenciales de prueba:");
  console.log("   ADMIN        → admin@amplix.com / 123456");
  console.log("   COLLABORATOR → colaborador@demo.com / 123456");
  console.log("   USER         → angel@demo.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
