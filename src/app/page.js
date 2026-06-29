"use client";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push("/chat");        // already logged in → go directly
    } else {
      signIn("google", { callbackUrl: "/chat" });  // not logged in → sign in first
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-[#0A0F1C] text-[#F1F5F9] overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-16 pb-12 overflow-hidden">
        {/* Radial glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-3xl bg-[#10B981]/8" />
        {/* Eyebrow badge */}
        <div className="flex items-center gap-2 rounded-full px-3.5 py-1 mb-5 border bg-[#10B981]/8 border-[#10B981]/25">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#10B981]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#10B981]">
            Trusted by 50,000+ farmers
          </span>
        </div>
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight max-w-xl mb-4 text-[#F1F5F9]">
          Your farm,{" "}
          <span className="bg-gradient-to-r from-[#10B981] to-[#6EE7B7] bg-clip-text text-transparent">
            smarter every day
          </span>
        </h1>
        {/* Subheading */}
        <p className="text-base max-w-sm leading-relaxed mb-8 text-[#F1F5F9]/50">
          AI-powered crop health, live mandi prices, and local weather — built for the fields of India.
        </p>
        {/* CTA */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={handleClick}
            disabled={status === "loading"}
            className="font-bold px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 text-sm bg-[#10B981] text-[#0A0F1C] hover:bg-[#0ea472] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Loading..." : "Get started →"}
          </button>
        </div>
      </section>

      {/* ── Section label ── */}
      <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] pb-6 text-[#64748B]/60">
        What you can do
      </p>

      {/* ── Feature grid — full bleed ── */}
      <div className="w-full border-t border-b border-[#64748B]/15 -mx-0">
        {/* 4 cards in one row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#64748B]/15">
          
          {/* AI Farmer Friend */}
          <Link
            href="/chat"
            className="group p-8 flex flex-col relative bg-[#141E30] hover:bg-[#1a2640] transition-colors border-r border-[#64748B]/15"
          >
            <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981]">
              AI
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5 bg-[#10B981]/10 text-[#10B981]">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
            </div>
            <h2 className="font-bold text-base mb-2 tracking-tight text-[#F1F5F9]">AI Farmer Friend</h2>
            <p className="text-sm leading-relaxed mb-5 text-[#64748B]">
              Ask about fertilizers, sowing windows, and pest control — in your own language.
            </p>
            <span className="text-xs font-semibold flex items-center gap-1 mt-auto text-[#64748B]/50 group-hover:text-[#10B981] transition-colors">
              Start chatting <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </span>
          </Link>

          {/* Crop Scan */}
          <Link
            href="/diagnosis"
            className="group p-8 flex flex-col relative bg-[#141E30] hover:bg-[#1a2640] transition-colors border-r border-[#64748B]/15"
          >
            <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981]">
              New
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5 bg-[#2563EB]/10 text-[#60A5FA]">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            <h2 className="font-bold text-base mb-2 tracking-tight text-[#F1F5F9]">Crop Scan</h2>
            <p className="text-sm leading-relaxed mb-5 text-[#64748B]">
              Photo your leaf, get an instant diagnosis with treatment steps.
            </p>
            <span className="text-xs font-semibold flex items-center gap-1 mt-auto text-[#64748B]/50 group-hover:text-[#10B981] transition-colors">
              Scan a crop <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </span>
          </Link>

          {/* Mandi & Weather */}
          <Link
            href="/dashboard"
            className="group p-8 flex flex-col relative bg-[#141E30] hover:bg-[#1a2640] transition-colors border-r border-[#64748B]/15"
          >
            <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-400">
              Live
            </span>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5 bg-amber-500/10 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 16 4 4 4-4" />
              </svg>
            </div>
            <h2 className="font-bold text-base mb-2 tracking-tight text-[#F1F5F9]">Mandi & Weather</h2>
            <p className="text-sm leading-relaxed mb-5 text-[#64748B]">
              Today mandi rates and 7-day hyperlocal forecasts tuned for sowing decisions.
            </p>
            <span className="text-xs font-semibold flex items-center gap-1 mt-auto text-[#64748B]/50 group-hover:text-[#10B981] transition-colors">
              Check prices <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </span>
          </Link>

          {/* Learn Farming */}
          <Link
            href="/learn"
            className="group p-8 flex flex-col relative bg-[#141E30] hover:bg-[#1a2640] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5 bg-[#2563EB]/10 text-[#60A5FA]">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="m6 12 6 3 6-3" />
                <path d="path... M6 15l6 3 6-3" />
                <path d="m6 18 6 3 6-3" />
              </svg>
            </div>
            <h2 className="font-bold text-base mb-2 tracking-tight text-[#F1F5F9]">Learn Farming</h2>
            <p className="text-sm leading-relaxed mb-5 text-[#64748B]">
              Short audio and video lessons on modern techniques, built for low-bandwidth connections.
            </p>
            <span className="text-xs font-semibold flex items-center gap-1 mt-auto text-[#64748B]/50 group-hover:text-[#10B981] transition-colors">
              Browse lessons <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </span>
          </Link>

        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="w-full px-8 py-4 flex flex-wrap items-center justify-between gap-3 border-t bg-[#141E30]/60 border-[#64748B]/15">
        <span className="text-xs text-[#64748B]/60">
          Available in 18 languages · Works offline in the field
        </span>
        <div className="flex gap-1.5">
          {["हिन्दी", "ਪੰਜਾਬੀ", "తెలుగు", "+15"].map((lang) => (
            <span
              key={lang}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-[#64748B]/20 text-[#64748B]/60"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}