import Image from "next/image";
import Link from "next/link";

// ─── Midnight Canopy Palette ───────────────────────────────────────────────
// Abyss (bg):            #0A0F1C
// Surface (elevated):    #141E30
// Canopy Green (accent): #10B981
// Deep Stream (blue):    #2563EB
// Starlight (text):      #F1F5F9
// Mist (muted/borders):  #64748B
// ──────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const navLinks = [
    { label: "Chat AI",   href: "/chat"      },
    { label: "Crop Scan", href: "/diagnosis" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Learn",     href: "/learn"     },
  ];

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur border-b"
      style={{
        background: "rgba(10, 15, 28, 0.88)",
        borderColor: "rgba(100, 116, 139, 0.2)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="relative w-8 h-8">
          <Image 
            src="/favicon.ico"
            alt="Kisaan Mitra Logo"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        <span className="font-extrabold text-lg tracking-tight" style={{ color: "#F1F5F9" }}>
          Kisaan Mitra
        </span>
      </Link>
                  
       
      {/* Desktop nav links */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="transition-colors duration-200"
            style={{ color: "#64748B" }}
          >
            {label}
          </Link>
        ))}

        {/* CTA pill */}
        <Link
          href="/chat"
          className="font-semibold text-xs px-4 py-1.5 rounded-full transition-colors duration-200"
          style={{ background: "#10B981", color: "#0A0F1C" }}
        >
          Login
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden transition-colors duration-200"
        style={{ color: "#64748B" }}
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </nav>
  );
}
