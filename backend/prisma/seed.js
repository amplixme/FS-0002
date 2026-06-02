//Importamos cliente que nos permite comunicarnos con la BD
import { PrismaClient } from "../src/generated/prisma/index.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main(){

    //Definición de las 5 categorías que pide la card (criterios de aceptación)
    const categories = [
        { name: "Tecnología", slug: "tecnologia"},
        { name: "Diseño", slug: "diseno"},
        { name: "Programación", slug: "programacion"},
        { name: "DevOps", slug: "devops"},
        { name: "Opinión", slug: "opinion"},
    ];

    for (const category of categories){
        await prisma.category.upsert({ //Usamos upsert porque en caso que la categoría exista no la duplique, si no existe la crea
            where: {slug: category.slug},
            update: {},
            create: category,
        });
    }
    console.log("Categorias creadas correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });