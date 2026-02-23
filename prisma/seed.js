import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding verified data...");

  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.log("No user found. Please login first to create a user in DB.");
    return;
  }

  const eliteProject = await prisma.project.upsert({
    where: { slug: "lumina-ai-photo-editor" },
    update: {
      status: "PUBLISHED",
      isVerified: true
    },
    create: {
      title: "Lumina AI Photo Editor",
      slug: "lumina-ai-photo-editor",
      description: "Advanced AI-powered photo editing tool with neural filters and autonomous retouching.",
      type: "SaaS",
      techStack: "Next.js, Python, OpenAI",
      mmr: 4250,
      price: 125000,
      status: "PUBLISHED",
      isVerified: true,
      userId: user.id,
      screenshots: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
    }
  });

  console.log("Elite Project Seeded:", eliteProject.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
