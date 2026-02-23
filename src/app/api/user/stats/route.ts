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
      select: { mmr: true, type: true, techStack: true }
    });

    let totalMinValuation = 0;
    let totalMaxValuation = 0;

    userProjects.forEach(p => {
      // 1. Base Type Multiplier
      let multiplier = 3.5; 
      if (p.type === 'SaaS') multiplier = 5.5;
      if (p.type === 'AI/ML') multiplier = 7.5;
      if (p.type === 'E-Commerce') multiplier = 2.8;
      
      // 2. Tech Stack Multiplier (Premium stacks get higher valuation)
      const stack = p.techStack.toLowerCase();
      let techBonus = 1.0;
      if (stack.includes('next.js') || stack.includes('react')) techBonus += 0.1;
      if (stack.includes('openai') || stack.includes('tensorflow')) techBonus += 0.2;
      if (stack.includes('go') || stack.includes('rust')) techBonus += 0.15;

      const adjustedMultiplier = multiplier * techBonus;
      const annualRevenue = p.mmr * 12;
      
      totalMinValuation += annualRevenue * (adjustedMultiplier * 0.85);
      totalMaxValuation += annualRevenue * (adjustedMultiplier * 1.15);
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
