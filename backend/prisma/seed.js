
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
  

  
  const postsData = [
    {
      title: "Arquitectura MERN para proyectos escalables",
      cat: "programacion",
    },
    {
      title: "Tips para afrontar entrevistas técnicas en inglés",
      cat: "opinion",
    },
    { title: "El futuro de React 19 y sus nuevos hooks", cat: "tecnologia" },
    { title: "¿Por qué usar TailwindCSS en 2026?", cat: "diseno" },
    {
      title: "Guía definitiva de Prisma ORM para principiantes",
      cat: "programacion",
    },
    { title: "Cómo optimizar tu perfil de LinkedIn como Dev", cat: "opinion" },
    { title: "Despliegue en la nube con Render paso a paso", cat: "devops" },
    { title: "Diseño UX/UI para desarrolladores Frontend", cat: "diseno" },
    {
      title: "JWT vs Cookies: ¿Cuál usar para autenticación?",
      cat: "tecnologia",
    },
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
  
  
  const commentTexts = [
    "¡Excelente artículo! Me sirvió muchísimo.",
    "Tenía esta duda hace semanas, gracias por aclararlo.",
    "Muy buena redacción, ¿para cuándo la segunda parte?",
    "Totalmente de acuerdo con tu punto de vista.",
    "Implementé esto en mi proyecto y funciona de diez.",
  ];

  let commentCount = 0;
  for (const post of createdPosts) {
    for (let j = 0; j < 2; j++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];

      await prisma.comment.create({
        data: { content: randomText, authorId: randomUser.id, postId: post.id },
      });
      commentCount++;
    }
  }
  

  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
