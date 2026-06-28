import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
          Kisaan Mitra
        </Link>
        
        {/* Scrollable links on mobile, horizontal on desktop */}
        <div className="flex gap-4 font-medium overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 text-sm sm:text-base">
          <Link href="/chat" className="hover:text-green-200 shrink-0">Chat AI</Link>
          <Link href="/diagnosis" className="hover:text-green-200 shrink-0">Crop Scan</Link>
          <Link href="/dashboard" className="hover:text-green-200 shrink-0">Dashboard</Link>
          <Link href="/learn" className="hover:text-green-200 shrink-0">Learn</Link>
          <Link href="/profile" className="hover:text-green-200 shrink-0">Profile</Link>
        </div>
      </div>
    </nav>
  );
}