import Link from 'next/link';

export default function Navbar() {
  return (
    // Glassy top bar: Translucent Abyss background with a Surface border
    <nav className="sticky top-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-lg border-b border-[#141E30]">
      <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide flex items-center gap-2 text-[#F1F5F9] hover:text-[#10B981] transition-colors">
          <span className="text-[#10B981]">🌱</span> Kisaan Mitra
        </Link>
        
        {/* Navigation Links - Mist text (#64748B) switching to Canopy Green (#10B981) on hover */}
        <div className="flex gap-6 font-medium overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 text-sm sm:text-base">
          <Link href="/chat" className="text-[#64748B] hover:text-[#10B981] transition-colors shrink-0">Chat AI</Link>
          <Link href="/diagnosis" className="text-[#64748B] hover:text-[#10B981] transition-colors shrink-0">Crop Scan</Link>
          <Link href="/dashboard" className="text-[#64748B] hover:text-[#10B981] transition-colors shrink-0">Dashboard</Link>
          <Link href="/learn" className="text-[#64748B] hover:text-[#10B981] transition-colors shrink-0">Learn</Link>
          <Link href="/profile" className="text-[#64748B] hover:text-[#10B981] transition-colors shrink-0">Profile</Link>
        </div>
      </div>
    </nav>
  );
}