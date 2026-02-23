import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

import { ProjectSchema } from "@/lib/validations/project";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Zod Validation
    const validation = ProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { title, description, type, mmr, price, techStack, storeUrl, screenshots, revenueModel, churnRate, ltv, appSize, ageRating, languages, lastUpdate, rating, reviewCount } = validation.data;

    const slug = title.toLowerCase().replace(/ /g, "-") + "-" + Math.random().toString(36).substring(2, 7);

    const project = await prisma.project.create({
      data: {
        title,
        description,
        slug,
        type,
        mmr,
        price,
        techStack,
        storeUrl,
        screenshots,
        revenueModel,
        churnRate,
        ltv,
        appSize,
        ageRating,
        languages,
        lastUpdate: lastUpdate ? new Date(lastUpdate) : undefined,
        rating,
        reviewCount,
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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    let where: any = { status: "PUBLISHED" };
    if (type && type !== "All") where.type = type;
    
    // Price filtering
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "priceHigh") orderBy = { price: "desc" };
    if (sort === "mmrHigh") orderBy = { mmr: "desc" };

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      include: { 
        user: { select: { id: true, name: true, avatar: true } },
        watchlistedBy: true
      }
    });

    const projectsWithWatchlist = projects.map(p => {
      const isWatchlisted = session?.user 
        // @ts-ignore
        ? p.watchlistedBy.some(w => w.userId === session.user.id)
        : false;
      
      const { watchlistedBy, ...rest } = p;
      return { ...rest, isWatchlisted };
    });

    return new Response(JSON.stringify(projectsWithWatchlist), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
