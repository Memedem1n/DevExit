import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, type, mmr, price, techStack, storeUrl } = body;

    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 7);

    const project = await prisma.project.create({
      data: {
        title,
        description,
        slug,
        type,
        mmr: parseFloat(mmr),
        price: parseFloat(price),
        techStack: Array.isArray(techStack) ? techStack.join(",") : techStack,
        storeUrl,
        // @ts-ignore
        userId: session.user.id,
        status: "PUBLISHED",
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, avatar: true } } }
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
