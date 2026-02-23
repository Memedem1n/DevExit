import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";

// NDA Durumunu Kontrol Et
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ isSigned: false });

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  // @ts-ignore
  const userId = session.user.id;

  if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

  try {
    const nda = await prisma.nDA.findUnique({
      where: {
        userId_projectId: { userId, projectId }
      }
    });
    return NextResponse.json({ isSigned: !!nda });
  } catch (error) {
    return NextResponse.json({ isSigned: false });
  }
}

// NDA İmzala
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-ignore
  const userId = session.user.id;

  try {
    const { projectId } = await req.json();

    const nda = await prisma.nDA.create({
      data: { userId, projectId }
    });

    // Satıcıya bildirim gönder (İsteğe bağlı ama güzel olur)
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.userId,
          type: "NDA",
          message: `${session.user.name}, '${project.title}' için NDA imzaladı.`,
          link: `/profile/${userId}`
        }
      });
    }

    return NextResponse.json(nda);
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign NDA" }, { status: 500 });
  }
}
