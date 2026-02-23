import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

// Takip listesini getir
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-ignore
  const userId = session.user.id;

  try {
    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        project: {
          include: { user: { select: { name: true, avatar: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(watchlist.map(w => w.project));
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

// Takip listesine ekle/çıkar (Toggle)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-ignore
  const userId = session.user.id;

  try {
    const { projectId } = await req.json();

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ status: "REMOVED" });
    } else {
      await prisma.watchlist.create({
        data: { userId, projectId }
      });
      return NextResponse.json({ status: "ADDED" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}
