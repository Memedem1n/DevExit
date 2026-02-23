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
    // Son teklifleri çek (Kullanıcının projelerine gelen)
    const recentOffers = await prisma.offer.findMany({
      where: {
        project: { userId }
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        buyer: { select: { name: true } },
        project: { select: { title: true } }
      }
    });

    // Aktivite formatına dönüştür
    const activities = recentOffers.map(offer => ({
      id: offer.id,
      type: "OFFER",
      status: offer.status,
      msg: `${offer.buyer.name}, '${offer.project.title}' projeniz için $${offer.amount.toLocaleString()} teklif verdi.`,
      time: offer.createdAt,
      color: offer.status === 'ACCEPTED' ? "bg-green-500/10 text-green-500 border-green-500/20" : 
             offer.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
             "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
    }));

    if (activities.length === 0) {
      activities.push({
        type: "SYSTEM",
        msg: "DevExit'e hoş geldiniz! İlk ilanınızı yayınlayarak teklif almaya başlayın.",
        time: new Date(),
        color: "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
      });
    }

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Fetch activity error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
