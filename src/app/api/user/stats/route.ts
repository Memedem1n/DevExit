import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-ignore
  const userId = session.user.id;

  try {
    const projectCount = await prisma.project.count({
      where: { userId },
    });

    const projects = await prisma.project.findMany({
      where: { userId },
      select: { views: true },
    });

    const totalViews = projects.reduce((acc, p) => acc + p.views, 0);

    const offerCount = await prisma.offer.count({
      where: { project: { userId } },
    });

    return NextResponse.json({
      projectCount,
      totalViews,
      offerCount,
      qualityScore: 98,
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
