import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            isVerified: true,
          }
        },
        offers: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Görüntülenme sayısını artır (Analytics simulation)
    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Fetch project detail error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
