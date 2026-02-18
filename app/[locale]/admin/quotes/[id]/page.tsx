import prisma from "@/lib/prisma";
import QuoteStatusUpdater from "@/components/admin/QuoteStatusUpdater";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Download, Building, Mail, Phone, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

export default async function QuoteDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
  });

  if (!quote) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center space-x-4 mb-8">
        <Link 
          href={`/${locale}/admin/quotes`}
          className="p-2 hover:bg-muted rounded-full transition-colors text-secondary"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase text-foreground">Request Details</h1>
          <p className="text-secondary text-sm">ID: <span className="font-mono text-accent">{quote.id}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Card */}
          <div className="bg-card border border-border p-8 shadow-sm">
            <h2 className="text-lg font-black uppercase mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Project Description
            </h2>
            <div className="bg-muted p-6 text-foreground leading-relaxed whitespace-pre-wrap font-medium">
              {quote.description}
            </div>
            
            {/* File Attachment */}
            {quote.fileUrl && (
              <div className="mt-8 border-t border-border pt-6">
                 <h3 className="text-sm font-black uppercase mb-4 text-secondary">Attached Files</h3>
                 <a 
                   href={quote.fileUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center p-4 border border-border bg-muted hover:border-accent hover:bg-accent/5 transition-all group"
                 >
                   <div className="bg-background p-3 rounded-md mr-4 border border-border group-hover:border-accent transition-colors">
                     <FileText className="w-6 h-6 text-foreground group-hover:text-accent" />
                   </div>
                   <div className="flex-grow">
                     <span className="block text-sm font-black uppercase text-foreground">Project Blueprint / Asset</span>
                     <span className="text-xs text-secondary truncate max-w-[200px] block">{quote.fileUrl.split('/').pop()}</span>
                   </div>
                   <Download className="w-5 h-5 text-secondary group-hover:text-accent" />
                 </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-card border border-border p-6 shadow-sm sticky top-6">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-primary-foreground font-black text-xl uppercase">
                  {quote.firstName[0]}{quote.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-foreground leading-none">{quote.firstName} {quote.lastName}</h3>
                  <span className="text-xs text-secondary uppercase tracking-widest mt-1 block">{quote.company || "Individual Client"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a href={`mailto:${quote.email}`} className="text-foreground hover:text-accent font-medium truncate">{quote.email}</a>
                </div>
                {quote.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <a href={`tel:${quote.phone}`} className="text-foreground hover:text-accent font-medium">{quote.phone}</a>
                  </div>
                )}
                {quote.company && (
                   <div className="flex items-center space-x-3 text-sm">
                    <Building className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-secondary font-medium">{quote.company}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-secondary font-medium">{new Date(quote.createdAt).toLocaleDateString(undefined, {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                 <div className="flex items-center space-x-3 text-sm">
                  <Clock className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-secondary font-medium">{new Date(quote.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Request Status</h4>
                 <QuoteStatusUpdater id={quote.id} initialStatus={quote.status} />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
