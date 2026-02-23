import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Categoriler
  const categories = [
    { name: "SaaS", slug: "saas" },
    { name: "Mobile App", slug: "mobile" },
    { name: "E-Commerce", slug: "ecommerce" },
    { name: "AI/ML", slug: "ai-ml" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
