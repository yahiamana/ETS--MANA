"use client";

import { useState, useEffect, use } from "react";
import { Loader2, Save, Globe, Phone, Mail, MapPin, Facebook, Linkedin, Instagram, Twitter, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteSettings {
  siteName: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  logoUrl: string | null;
  heroImageUrl: string | null;
  
  // Home Page Media
  introImageUrl: string | null;
  portfolioProject1Url: string | null;
  portfolioProject2Url: string | null;
  portfolioProject3Url: string | null;
  
  // Services Media
  servicesMachiningUrl: string | null;
  servicesRepairUrl: string | null;
  servicesFabricationUrl: string | null;
  servicesModificationUrl: string | null;
  servicesManufacturingUrl: string | null;
  servicesRestorationUrl: string | null;
  servicesGuidanceUrl: string | null;
  
  // About Page Media
  aboutStoryUrl: string | null;
  aboutVisualBreakUrl: string | null;
}

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings updated successfully." });
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings({ ...settings, [field]: data.url });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
        <span className="font-black uppercase tracking-[0.2em] text-xs">Loading Configuration...</span>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Site <span className="text-accent text-2xl font-bold">Settings</span></h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Global configuration for address, contact info, and branding.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={saving}
          className="bg-accent text-white px-8 py-4 rounded-none font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={cn(
          "p-6 border-l-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300",
          message.type === "success" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-rose-50 border-rose-500 text-rose-800"
        )}>
          {message.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <span className="font-bold uppercase tracking-wider text-sm">{message.text}</span>
        </div>
      )}

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Core Info */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <Globe className="w-6 h-6 text-accent" />
            General Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Website Name</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm font-bold focus:border-accent outline-none transition-colors"
                placeholder="e.g. MANA Workshops"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 pl-12 text-sm font-bold focus:border-accent outline-none transition-colors"
                  placeholder="Street, City, Country"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact info */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <Phone className="w-6 h-6 text-accent" />
            Contact & Communication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 pl-12 text-sm font-bold focus:border-accent outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 pl-12 text-sm font-bold focus:border-accent outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <Linkedin className="w-6 h-6 text-accent" />
            Social Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Linkedin className="w-3 h-3" /> Linkedin URL
              </label>
              <input 
                type="url" 
                value={settings.linkedin || ""}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm font-bold focus:border-accent outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Facebook className="w-3 h-3" /> Facebook URL
              </label>
              <input 
                type="url" 
                value={settings.facebook || ""}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm font-bold focus:border-accent outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Instagram className="w-3 h-3" /> Instagram URL
              </label>
              <input 
                type="url" 
                value={settings.instagram || ""}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-sm font-bold focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Media & Branding - Core */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-accent" />
            Core Branded Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageUploadField 
              label="Website Logo" 
              value={settings.logoUrl} 
              onUpload={(e) => handleImageUpload(e, "logoUrl")} 
              helperText="Click box to upload PNG or SVG. Suggested height: 40px."
            />
            <ImageUploadField 
              label="Default Hero Image" 
              value={settings.heroImageUrl} 
              onUpload={(e) => handleImageUpload(e, "heroImageUrl")} 
              helperText="High resolution landscape image (1920x1080)."
              aspect="video"
            />
          </div>
        </section>

        {/* Home Page Media */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-accent" />
            Home Page Section Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageUploadField 
              label="Intro Section Image" 
              value={settings.introImageUrl} 
              onUpload={(e) => handleImageUpload(e, "introImageUrl")} 
              aspect="tall"
            />
            <div className="space-y-8">
              <ImageUploadField 
                label="Portfolio Project 1" 
                value={settings.portfolioProject1Url} 
                onUpload={(e) => handleImageUpload(e, "portfolioProject1Url")} 
                aspect="square"
              />
              <ImageUploadField 
                label="Portfolio Project 2" 
                value={settings.portfolioProject2Url} 
                onUpload={(e) => handleImageUpload(e, "portfolioProject2Url")} 
                aspect="square"
              />
              <ImageUploadField 
                label="Portfolio Project 3" 
                value={settings.portfolioProject3Url} 
                onUpload={(e) => handleImageUpload(e, "portfolioProject3Url")} 
                aspect="square"
              />
            </div>
          </div>
        </section>

        {/* Services Page Media */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-accent" />
            Services Page Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ImageUploadField 
              label="Manufacturing" 
              value={settings.servicesManufacturingUrl} 
              onUpload={(e) => handleImageUpload(e, "servicesManufacturingUrl")} 
              aspect="square"
            />
            <ImageUploadField 
              label="Restoration" 
              value={settings.servicesRestorationUrl} 
              onUpload={(e) => handleImageUpload(e, "servicesRestorationUrl")} 
              aspect="square"
            />
            <ImageUploadField 
              label="Modification" 
              value={settings.servicesModificationUrl} 
              onUpload={(e) => handleImageUpload(e, "servicesModificationUrl")} 
              aspect="square"
            />
            <ImageUploadField 
              label="Machining" 
              value={settings.servicesMachiningUrl} 
              onUpload={(e) => handleImageUpload(e, "servicesMachiningUrl")} 
              aspect="square"
            />
            <ImageUploadField 
              label="Technical Guidance" 
              value={settings.servicesGuidanceUrl} 
              onUpload={(e) => handleImageUpload(e, "servicesGuidanceUrl")} 
              aspect="square"
            />
          </div>
        </section>

        {/* About Page Media */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl">
          <h3 className="text-xl font-black uppercase tracking-tight mb-10 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-accent" />
            About Page Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageUploadField 
              label="Company Story Image" 
              value={settings.aboutStoryUrl} 
              onUpload={(e) => handleImageUpload(e, "aboutStoryUrl")} 
              aspect="square"
            />
            <ImageUploadField 
              label="Visual Break Image" 
              value={settings.aboutVisualBreakUrl} 
              onUpload={(e) => handleImageUpload(e, "aboutVisualBreakUrl")} 
              aspect="video"
            />
          </div>
        </section>
      </form>
    </div>
  );
}

function ImageUploadField({ 
  label, 
  value, 
  onUpload, 
  helperText, 
  aspect = "square" 
}: { 
  label: string; 
  value: string | null; 
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  aspect?: "square" | "video" | "tall" | "any";
}) {
  return (
    <div className="space-y-6">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">{label}</label>
      <div className={cn(
        "bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 text-center transition-colors hover:border-accent group relative overflow-hidden flex items-center justify-center",
        aspect === "square" ? "aspect-square" : aspect === "video" ? "aspect-video" : aspect === "tall" ? "aspect-[4/5]" : "h-48"
      )}>
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-10 h-10 text-slate-200 group-hover:text-accent transition-colors" />
        )}
        <input 
          type="file" 
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
          accept="image/*"
        />
      </div>
      {helperText && <p className="text-[10px] text-slate-500 font-medium">{helperText}</p>}
    </div>
  );
}
