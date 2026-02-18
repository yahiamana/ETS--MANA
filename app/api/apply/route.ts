import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { applicationSchema } from "@/lib/recruitmentValidations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = applicationSchema.parse(body);

    const application = await prisma.application.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        jobId: validatedData.jobId,
        cvUrl: validatedData.cvUrl,
        message: validatedData.message,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error: any) {
    console.error("Application Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application" },
      { status: 400 }
    );
  }
}
