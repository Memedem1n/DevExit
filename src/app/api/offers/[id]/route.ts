import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body; // ACCEPTED or REJECTED

    // Offer'ı ve Proje Sahibini kontrol et
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    // Sadece proje sahibi teklifi yönetebilir
    // @ts-ignore
    if (offer.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Update offer status error:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
