import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth";
import { MessageSchema } from "@/lib/validations/project";

// Yeni mesaj gönderme
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    
    // Zod Validation
    const validation = MessageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { content, receiverId, projectId, fileUrl, fileType } = validation.data;

    const message = await prisma.message.create({
      data: {
        content,
        receiverId,
        projectId,
        fileUrl,
        fileType,
        // @ts-ignore
        senderId: session.user.id
      },
      include: { sender: { select: { name: true } } }
    });

    // Alıcıya bildirim oluştur
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE",
        message: `${message.sender.name} size yeni bir mesaj gönderdi.`,
        link: "/chat"
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// Kullanıcının sohbet listesini (inbox) getir
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // @ts-ignore
  const userId = session.user.id;

  try {
    // Son mesajları getiren ve konuşmaları gruplayan bir sorgu
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        project: { select: { title: true } }
      }
    });

    // Mesajları "Konuşmalar" (Conversations) bazında gruplayabiliriz
    // Ama basitlik için şimdilik sadece tüm mesaj listesini dönüyoruz
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
