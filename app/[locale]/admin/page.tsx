import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Briefcase,
  AlertTriangle
} from "lucide-react";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const stats = [
    { label: "Active Project", value: "12", icon: Briefcase, color: "text-blue-600" },
    { label: "New Quotes", value: "5", icon: MessageSquare, color: "text-accent" },
    { label: "Active Jobs", value: "3", icon: Users, color: "text-green-600" },
    { label: "Monthly Growth", value: "+14%", icon: TrendingUp, color: "text-secondary" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">System <span className="text-secondary text-2xl font-bold">Overview</span></h1>
        <p className="text-secondary mt-2">Welcome back, Administrator. Workshop status is normal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-8 border border-border group hover:border-accent transition-colors">
            <div className={`p-3 bg-muted rounded-none w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="block text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-2">{stat.label}</span>
            <span className="text-3xl font-black text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Activity Placeholder */}
        <div className="bg-card border border-border p-8 transition-colors">
          <h2 className="text-xl font-black uppercase mb-8 border-b border-border pb-4">Recent Inquiries</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-bold text-foreground">Hydraulic System Repair</h4>
                  <span className="text-[10px] uppercase font-black tracking-widest text-secondary/60">AgriCorp Solutions</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-accent italic">NEW</span>
                  <span className="text-[10px] text-secondary/40 font-bold uppercase">2h ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-card border border-border p-8 transition-colors">
          <h2 className="text-xl font-black uppercase mb-8 border-b border-border pb-4">System Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-start bg-red-500/10 p-4 border-l-4 border-red-500">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-500">Database Backup Delayed</p>
                <p className="text-xs text-red-400">The scheduled backup was skipped due to high server load.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
