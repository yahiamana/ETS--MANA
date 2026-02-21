import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { id: "singleton" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    // Explicitly define allowed fields to prevent Prisma errors from unexpected data
    const allowedFields = [
      "siteName", "address", "email", "phone", "whatsapp", 
      "facebook", "linkedin", "instagram", "logoUrl", "heroImageUrl",
      "introImageUrl", "portfolioProject1Url", "portfolioProject2Url", "portfolioProject3Url",
      "servicesMachiningUrl", "servicesRepairUrl", "servicesFabricationUrl", "servicesModificationUrl",
      "servicesManufacturingUrl", "servicesRestorationUrl", "servicesGuidanceUrl",
      "aboutStoryUrl", "aboutVisualBreakUrl",
      "businessHoursMon", "businessHoursTue", "businessHoursWed", 
      "businessHoursThu", "businessHoursFri", "businessHoursSat", "businessHoursSun"
    ];

    const updateData: any = {};
    allowedFields.forEach(field => {
      if (field in body) {
        updateData[field] = body[field];
      }
    });

    const settings = await prisma.siteSetting.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: { ...updateData, id: "singleton" },
    });

    // Revalidate paths to reflect changes immediately
    revalidatePath("/");
    revalidatePath("/[locale]/contact", "page");

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ 
      error: "Failed to update settings", 
      details: error.message 
    }, { status: 500 });
  }
}
