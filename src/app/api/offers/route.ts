import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";
import { OfferSchema } from "@/lib/validations/project";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Zod Validation
    const validation = OfferSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { projectId, amount, message } = validation.data;

    // Teklifi kaydet
    const offer = await prisma.offer.create({
      data: {
        amount,
        message,
        projectId,
        // @ts-ignore
        buyerId: session.user.id,
        status: "PENDING",
      },
      include: { project: true, buyer: { select: { name: true } } }
    });

    // Proje sahibine bildirim oluştur
    await prisma.notification.create({
      data: {
        userId: offer.project.userId,
        type: "OFFER",
        message: `${offer.buyer.name}, '${offer.project.title}' projeniz için $${offer.amount.toLocaleString()} teklif verdi.`,
        link: "/dashboard"
      }
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Offer creation error:", error);
    return NextResponse.json({ error: "Failed to send offer" }, { status: 500 });
  }
}
