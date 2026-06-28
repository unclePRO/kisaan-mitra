import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Kisaan Mitra | AI Farmer Friend',
  description: 'Smart farming assistant, crop diagnosis, and real-time market data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        bg-[#0A0F1C]: Abyss background
        text-[#F1F5F9]: Starlight text
        selection:*: Custom highlight color using Canopy Green
      */}
      <body className="bg-[#0A0F1C] text-[#F1F5F9] min-h-screen flex flex-col font-sans selection:bg-[#10B981] selection:text-[#0A0F1C]">
        <Navbar />
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}