import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-green-800">
          Kisaan Mitra
        </h1>
        <p className="text-gray-600 max-w-sm mx-auto">
          Your personal farming assistant for Banda, Uttar Pradesh and beyond. 
          Get instant answers, crop health checks, and local market prices.
        </p>
      </div>

      {/* Grid of features linking to the different routes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <Link href="/chat" className="bg-white border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🤖</span>
          <h2 className="font-bold text-lg text-green-700">AI Farmer Friend</h2>
          <p className="text-sm text-gray-500">Ask questions about fertilizers and timing.</p>
        </Link>

        <Link href="/diagnosis" className="bg-white border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <span className="text-3xl mb-2">📸</span>
          <h2 className="font-bold text-lg text-green-700">Crop Scan</h2>
          <p className="text-sm text-gray-500">Upload a leaf photo for instant disease diagnosis.</p>
        </Link>

        <Link href="/dashboard" className="bg-white border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <span className="text-3xl mb-2">🌦️</span>
          <h2 className="font-bold text-lg text-green-700">Mandi & Weather</h2>
          <p className="text-sm text-gray-500">Live prices and local weather forecasts.</p>
        </Link>

        <Link href="/learn" className="bg-white border border-green-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <span className="text-3xl mb-2">📚</span>
          <h2 className="font-bold text-lg text-green-700">Learn Farming</h2>
          <p className="text-sm text-gray-500">Quick audio and visual tutorials for better yields.</p>
        </Link>
      </div>
    </div>
  );
}