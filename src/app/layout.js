import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Kisaan Mitra',
  description: 'Smart farming assistant, crop diagnosis, and real-time market data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow w-full max-w-md sm:max-w-4xl mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}