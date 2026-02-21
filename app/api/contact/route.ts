import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      },
    });

    return NextResponse.json({ success: true, id: message.id });
  } catch (error: any) {
    console.error("Contact Message Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message" },
      { status: 400 }
    );
  }
}
