import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { ProjectDetailClient } from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("Portfolio");
  const tc = await getTranslations("Common");

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const title = (project.title as any)[locale] || (project.title as any)["en"];
  const description = (project.description as any)?.[locale] || (project.description as any)?.["en"] || "";

  return (
    <ProjectDetailClient 
      project={JSON.parse(JSON.stringify(project))} 
      locale={locale} 
      title={title} 
      description={description} 
      tc_back={tc("back")} 
      t_desc={t("projectDescription")}
      t_classification={t("classification")}
      t_completion={t("completion")}
      t_cta={t("requestQuoteSimilar")}
    />
  );
}
