import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ApplicationForm from "@/components/recruitment/ApplicationForm";
import { MapPin, Briefcase, Clock, Banknote, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; jobId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, jobId } = await params;
  const job = await prisma.jobListing.findUnique({ where: { id: jobId } });
  
  if (!job) return { title: "Job Not Found" };

  const title = (job.title as any)[locale] || (job.title as any)['en'];
  return {
    title: `${title} | MANA Careers`,
    description: `Apply for the ${title} position at MANA Workshop.`,
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { locale, jobId } = await params;
  
  const job = await prisma.jobListing.findUnique({
    where: { id: jobId },
  });

  if (!job || job.status !== "PUBLISHED") {
    notFound();
  }

  const title = (job.title as any)[locale] || (job.title as any)['en'];
  const description = (job.description as any)[locale] || (job.description as any)['en'];
  const requirements = (job.requirements as any)[locale] || (job.requirements as any)['en'];

  return (
    <div className="bg-muted min-h-screen pb-24">
      {/* Header */}
      <section className="bg-primary text-primary-foreground pt-32 pb-20 industrial-grid relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            href={`/${locale}/recruitment`}
            className="inline-flex items-center text-accent font-bold uppercase tracking-widest text-xs mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight max-w-4xl">
            {title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <div className="bg-accent/20 p-2 rounded-full"><Briefcase className="w-4 h-4 text-accent" /></div>
              <span>{job.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-accent/20 p-2 rounded-full"><MapPin className="w-4 h-4 text-accent" /></div>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-accent/20 p-2 rounded-full"><Clock className="w-4 h-4 text-accent" /></div>
              <span>{job.jobType.replace("_", " ")}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center gap-2">
                <div className="bg-accent/20 p-2 rounded-full"><Banknote className="w-4 h-4 text-accent" /></div>
                <span>{job.salaryRange}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Background Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent/5 -skew-x-12 hidden md:block" />
      </section>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border p-10 shadow-sm">
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center">
                <span className="w-2 h-8 bg-accent mr-4" /> 
                Role Description
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none text-secondary leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            <div className="bg-card border border-border p-10 shadow-sm">
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center">
                <span className="w-2 h-8 bg-accent mr-4" /> 
                Requirements
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none text-secondary leading-relaxed whitespace-pre-line">
                {requirements}
              </div>
            </div>
          </div>

          {/* Sidebar / Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ApplicationForm 
                jobId={job.id} 
                jobTitle={title} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
