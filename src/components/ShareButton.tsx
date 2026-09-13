"use client";

import { useState } from "react";
import { Share2, Check, MessageCircle, Copy } from "lucide-react";
import { trackCTA } from "@/lib/analytics";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({
  title = "DesiSports V2 — Team DNA™ & Indoor Cricket Intelligence",
  text = "Check out Team DNA™, player insights and match scorecards on DesiSports V2!",
  url,
  className = "",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") return window.location.href;
    return "https://desisports.milanchheda.com";
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    trackCTA("share_button_click", "VISITOR", { url: shareUrl });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        trackCTA("share_native_success", "VISITOR", { url: shareUrl });
        return;
      } catch (err) {
        // User cancelled or share unsupported, fallback to dropdown
      }
    }
    setMenuOpen(!menuOpen);
  };

  const handleCopy = async () => {
    const shareUrl = getShareUrl();
    trackCTA("share_copy_link", "VISITOR", { url: shareUrl });
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setMenuOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleWhatsApp = () => {
    const shareUrl = getShareUrl();
    trackCTA("share_whatsapp", "VISITOR", { url: shareUrl });
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${text} ${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
    setMenuOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handleShare}
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all shadow-2xs active:scale-95"
        title="Share this page"
      >
        <Share2 className="h-3.5 w-3.5 text-slate-600" />
        <span>Share</span>
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Share With Team
              </span>
              <span className="text-xs font-semibold text-slate-900 truncate block mt-0.5">
                DesiSports V2
              </span>
            </div>

            <div className="py-1 space-y-1">
              <button
                onClick={handleWhatsApp}
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                  <MessageCircle className="h-3.5 w-3.5 fill-white" />
                </div>
                <span>Share via WhatsApp</span>
              </button>

              <button
                onClick={handleCopy}
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition"
              >
                <div className="h-6 w-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </div>
                <span>{copied ? "Link Copied!" : "Copy Page Link"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
