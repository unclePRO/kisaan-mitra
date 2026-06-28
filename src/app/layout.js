import AuthProvider from '@/components/AuthProvider';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Kisaan Mitra | AI Farmer Friend',
  description: 'Smart farming assistant, crop diagnosis, and real-time market data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0F1C] text-[#F1F5F9] min-h-screen flex flex-col font-sans selection:bg-[#10B981] selection:text-[#0A0F1C]">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow w-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}