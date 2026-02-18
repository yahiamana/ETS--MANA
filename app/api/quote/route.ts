import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { quoteSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = quoteSchema.parse(body);

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        description: validatedData.description,
        fileUrl: validatedData.fileUrl,
        // We can add urgency and serviceType to the model if needed, but for now we follow the schema.prisma
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: quoteRequest.id });
  } catch (error: any) {
    console.error("Quote Request Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit quote request" },
      { status: 400 }
    );
  }
}
