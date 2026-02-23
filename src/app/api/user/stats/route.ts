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

    // AI Valuation Logic
    const userProjects = await prisma.project.findMany({
      where: { userId, status: "PUBLISHED" },
      select: { mmr: true, type: true }
    });

    let totalMinValuation = 0;
    let totalMaxValuation = 0;

    userProjects.forEach(p => {
      // Industry multipliers: SaaS (4x-6x annual), Mobile (2x-4x annual), AI/ML (5x-8x)
      let multiplier = 3.5; 
      if (p.type === 'SaaS') multiplier = 5;
      if (p.type === 'AI/ML') multiplier = 7;
      if (p.type === 'E-Commerce') multiplier = 2.5;
      
      const annualRevenue = p.mmr * 12;
      totalMinValuation += annualRevenue * (multiplier * 0.8);
      totalMaxValuation += annualRevenue * (multiplier * 1.2);
    });

    return NextResponse.json({
      projectCount,
      totalViews,
      offerCount,
      qualityScore: 98,
      valuation: {
        min: totalMinValuation,
        max: totalMaxValuation
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
