import prisma from "./prisma";

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { id: "singleton" },
      });
    }

    return settings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return {
      siteName: "MANA",
      address: "123 Industrial Zone, Agricultural District",
      email: "contact@manaworkshops.com",
      phone: "+1 (234) 567-890",
      facebook: null,
      linkedin: null,
      instagram: null,
      logoUrl: null,
      heroImageUrl: null,
      whatsapp: null,
      introImageUrl: null,
      portfolioProject1Url: null,
      portfolioProject2Url: null,
      portfolioProject3Url: null,
      servicesMachiningUrl: null,
      servicesRepairUrl: null,
      servicesFabricationUrl: null,
      servicesModificationUrl: null,
      aboutStoryUrl: null,
      aboutVisualBreakUrl: null,
    };
  }
}
