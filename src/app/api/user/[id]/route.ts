import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { createdAt: "desc" }
        },
        offersSent: {
          where: { status: "ACCEPTED" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Badge Calculation Logic
    const badges = [];
    const totalListingValue = user.projects.reduce((acc, p) => acc + p.price, 0);
    const hasAcceptedOffer = user.offersSent.length > 0;
    const projectCount = user.projects.length;

    if (totalListingValue > 10000) badges.push({ id: "elite", label: "Elite Partner", color: "text-brand-blue", icon: "Award" });
    if (hasAcceptedOffer) badges.push({ id: "verified_buyer", label: "Verified Buyer", color: "text-green-500", icon: "ShieldCheck" });
    if (projectCount >= 3) badges.push({ id: "pro_builder", label: "Pro Builder", color: "text-purple-500", icon: "Zap" });
    
    // Pioneer badge for early users
    const joinDate = new Date(user.createdAt);
    if (joinDate.getFullYear() <= 2026) badges.push({ id: "pioneer", label: "Pioneer", color: "text-orange-500", icon: "Star" });

    return NextResponse.json({ ...user, badges });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // @ts-ignore
  if (session.user.id !== params.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { name, avatar, currentRole } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { name, avatar, currentRole }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
