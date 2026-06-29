"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

// ─── Midnight Canopy Palette ───────────────────────────────────────────────
// Abyss (bg):            #0A0F1C
// Surface (elevated):    #141E30
// Canopy Green (accent): #10B981
// Deep Stream (blue):    #2563EB
// Starlight (text):      #F1F5F9
// Mist (muted/borders):  #64748B
// ──────────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Links visible to EVERYONE
  const publicLinks = [
    { label: "Chat AI",   href: "/chat"      },
    { label: "Crop Scan", href: "/diagnosis" },
    { label: "Learn",     href: "/learn"     },
  ];

  // Links visible ONLY when logged in
  const privateLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile",   href: "/profile"   },
  ];

  // Combine links based on authentication state
  const navLinks = session ? [...publicLinks, ...privateLinks] : publicLinks;

  // Helper to close menu when a link is clicked on mobile
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur border-b"
      style={{
        background: "rgba(10, 15, 28, 0.88)",
        borderColor: "rgba(100, 116, 139, 0.2)",
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="relative w-8 h-8">
            <Image 
              src="/logo.PNG"
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
              className="transition-colors duration-200 hover:text-[#10B981]"
              style={{ color: "#64748B" }}
            >
              {label}
            </Link>
          ))}

          {/* Desktop Auth CTA Pill */}
          {status === "loading" ? (
            <div className="w-16 h-7 rounded-full bg-[#141E30] animate-pulse"></div>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="font-semibold text-xs px-4 py-1.5 rounded-full transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400 border border-[#64748B]/30"
              style={{ background: "#141E30", color: "#F1F5F9" }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="font-semibold text-xs px-4 py-1.5 rounded-full transition-colors duration-200 hover:opacity-90"
              style={{ background: "#10B981", color: "#0A0F1C" }}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 -mr-2 transition-colors duration-200 hover:text-[#F1F5F9]"
          style={{ color: "#64748B" }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            // Close (X) icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden flex flex-col px-6 py-4 border-t border-[#64748B]/20 bg-[#0A0F1C]/95 backdrop-blur-md space-y-4">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              className="block text-base font-medium transition-colors duration-200 hover:text-[#10B981]"
              style={{ color: "#F1F5F9" }}
            >
              {label}
            </Link>
          ))}
          
          <div className="pt-2">
            {status === "loading" ? (
              <div className="w-24 h-10 rounded-lg bg-[#141E30] animate-pulse"></div>
            ) : session ? (
              <button
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
                className="w-full font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400 border border-[#64748B]/30"
                style={{ background: "#141E30", color: "#F1F5F9" }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  signIn("google");
                }}
                className="w-full font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors duration-200 hover:opacity-90"
                style={{ background: "#10B981", color: "#0A0F1C" }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}