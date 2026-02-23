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
    const { projectId, amount, message } = body;

    // Teklifi kaydet
    const offer = await prisma.offer.create({
      data: {
        amount: parseFloat(amount),
        message,
        projectId,
        // @ts-ignore
        buyerId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Offer creation error:", error);
    return NextResponse.json({ error: "Failed to send offer" }, { status: 500 });
  }
}
