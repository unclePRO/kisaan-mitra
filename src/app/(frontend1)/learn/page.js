"use client";

import { useState } from "react";
import Link from "next/link";

export default function Learn() {
  const [activeFormat, setActiveFormat] = useState("All Formats");
  const [activeItem, setActiveItem] = useState(null);
  
  // New state for the AI Prompt Bar input
  const [searchQuery, setSearchQuery] = useState("");

  // ── MASSIVE CONTENT LIBRARY ──
  const contentItems = [
    {
      id: 1,
      title: "Complete Guide to Organic Neem-Based Pesticides",
      type: "Read",
      duration: "6 min read",
      category: "Pest Control",
      summary: "Learn how to prepare, dilute, and safely apply homemade neem kernel extracts to protect your crops without toxic chemicals.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>Neem Seed Kernel Extract (NSKE) is a highly effective, low-cost botanical pesticide that targets over 200 species of pests, including bollworms, aphids, and whiteflies.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Ingredients Needed:</h4>
          <ul className="list-disc pl-5 space-y-2 text-[#64748B]">
            <li>5 kg of good quality, dried neem seeds (not older than 8 months)</li>
            <li>100 liters of clean water</li>
            <li>200 grams of soap powder or khadi soap (acts as a sticker/spreader)</li>
          </ul>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Preparation Steps:</h4>
          <p>1. Pound the neem seeds gently to remove the outer seed coat. <br/>2. Soak the pounded kernels in 10 liters of water overnight (at least 12 hours). <br/>3. The next morning, squeeze the extract through a muslin cloth. <br/>4. Add the remaining 90 liters of water and the soap powder. Mix thoroughly until suds form.</p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200/90 mt-6">
            <strong>Pro Tip:</strong> Always spray during the late afternoon or evening. Sunlight degrades the active compound (Azadirachtin) very quickly!
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Vermicompost: Turn Farm Waste into Black Gold",
      type: "Read",
      duration: "10 min read",
      category: "Soil Health",
      summary: "A step-by-step blueprint for building a vermicompost pit on your farm, selecting the right earthworms, and harvesting nutrient-rich compost.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>Vermicomposting is the process of using earthworms to turn organic waste into high-quality compost. It improves soil aeration, water retention, and provides essential macro-nutrients to your crops.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">1. Site Selection & Pit Construction</h4>
          <p>Select a shaded area, preferably under a tree or a thatched roof, to protect the worms from direct sunlight and heavy rain. The standard pit size is 10 feet long, 3 feet wide, and 1.5 feet deep. Do not make it deeper than 1.5 feet, as worms require oxygen.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">2. The Layering Process</h4>
          <ul className="list-decimal pl-5 space-y-2 text-[#64748B]">
            <li><strong>Base Layer:</strong> 2-3 inches of broken bricks, coarse sand, or coconut husks for drainage.</li>
            <li><strong>Second Layer:</strong> 6 inches of partially decomposed cow dung.</li>
            <li><strong>Third Layer:</strong> Dry agricultural waste (leaves, straw, chopped crop residue).</li>
            <li><strong>Top Layer:</strong> Introduce the worms (Eisenia fetida or Eudrilus eugeniae are best for India). Use about 1,000 worms per square meter.</li>
          </ul>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">3. Maintenance</h4>
          <p>Sprinkle water daily to maintain 40-50% moisture. The compost will be ready to harvest in 45 to 60 days when it appears dark, granular, and smells like fresh earth.</p>
        </div>
      )
    },
    {
      id: 3,
      title: "PM-Kisan Scheme: Step-by-Step Registration Guide",
      type: "Read",
      duration: "8 min read",
      category: "Govt Schemes",
      summary: "Clear checklist of documents required, eligibility parameters, and portal links to secure your ₹6000 annual income support.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme that provides ₹6,000 per year in three equal installments to all landholding farmer families.</p>
          <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg text-[#10B981] mt-4">
            <strong>Update:</strong> e-KYC is now MANDATORY for all PM-Kisan beneficiaries to receive the next installment.
          </div>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Documents Required:</h4>
          <ul className="list-disc pl-5 space-y-2 text-[#64748B]">
            <li>Aadhaar Card (must be linked to your mobile number)</li>
            <li>Land ownership documents (Khatauni / Patta)</li>
            <li>Bank Account Details (Passbook)</li>
            <li>Active Mobile Number</li>
          </ul>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">How to Apply Online:</h4>
          <p>1. Visit the official website: <strong>pmkisan.gov.in</strong><br/>2. Click on New Farmer Registration in the Farmer Corner.<br/>3. Select Rural or Urban Farmer Registration.<br/>4. Enter your Aadhaar Number, Mobile Number, and select your State.<br/>5. Fill out the application form with your land details and bank information.<br/>6. Upload the required land documents in PDF format and click Submit.</p>
        </div>
      )
    },
    {
      id: 4,
      title: "Diagnosing Micro-Nutrient Deficiencies from Leaves",
      type: "Read",
      duration: "12 min read",
      category: "Soil Health",
      summary: "Learn to read your crops like a book. Diagnose Zinc, Iron, and Boron deficiencies by observing leaf discoloration patterns.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>Plants communicate their nutritional needs through their leaves. While Nitrogen, Phosphorus, and Potassium (NPK) are well-known, micro-nutrients are equally critical for yield.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">1. Zinc (Zn) Deficiency</h4>
          <p><strong>Symptoms:</strong> Appears first on younger leaves. The area between the veins turns yellow, while the veins remain green (interveinal chlorosis). Leaves may become stunted or form a rosette shape.</p>
          <p><strong>Treatment:</strong> Apply Zinc Sulphate (ZnSO4) at 20-25 kg/hectare as a basal dose, or spray a 0.5% solution on the foliage.</p>
          
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">2. Iron (Fe) Deficiency</h4>
          <p><strong>Symptoms:</strong> Extreme yellowing or whitening of the youngest leaves. The veins usually remain distinctly green initially. Common in alkaline or waterlogged soils.</p>
          <p><strong>Treatment:</strong> Foliar spray of Ferrous Sulphate (0.5% to 1%) mixed with citric acid to prevent oxidation.</p>

          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">3. Boron (B) Deficiency</h4>
          <p><strong>Symptoms:</strong> Terminal buds die. Stems become brittle and cracked. Fruits may be deformed, cracked, or contain corky tissue (e.g., in tomatoes and papaya).</p>
          <p><strong>Treatment:</strong> Apply Borax at 10 kg/hectare to the soil, or spray 0.2% Boric acid during the flowering stage.</p>
        </div>
      )
    },
    {
      id: 5,
      title: "Kisan Credit Card (KCC): Unlock Farm Loans",
      type: "Read",
      duration: "5 min read",
      category: "Govt Schemes",
      summary: "Understand how to get a Kisan Credit Card for short-term agricultural loans at incredibly low interest rates.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>The Kisan Credit Card (KCC) scheme ensures farmers have access to adequate credit for agricultural operations without falling into the trap of private money lenders.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Key Benefits:</h4>
          <ul className="list-disc pl-5 space-y-2 text-[#64748B]">
            <li>Short-term credit for seeds, fertilizers, and machinery.</li>
            <li>Interest subvention: Base rate is 7%, but prompt repayment brings it down to <strong>4% per annum</strong>.</li>
            <li>No collateral required for loans up to ₹1.6 Lakhs.</li>
            <li>Includes built-in crop insurance coverage.</li>
          </ul>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">How to Apply:</h4>
          <p>You can apply at any commercial bank, Regional Rural Bank (RRB), or Cooperative bank. You need your land documents, Aadhaar card, PAN card, and passport-size photographs. Forms can also be downloaded directly from the PM-KISAN portal.</p>
        </div>
      )
    },
    {
      id: 6,
      title: "Battling Fall Armyworm in Maize",
      type: "Read",
      duration: "7 min read",
      category: "Pest Control",
      summary: "Identify the devastating Fall Armyworm early and deploy biological and chemical controls before it destroys your maize crop.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h14v6.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5z"/><path d="M6 2v13H4V3.5A1.5 1.5 0 0 1 5.5 2H6z"/><path d="M16 6h4"/><path d="M16 10h4"/></svg>,
      fullContent: (
        <div className="space-y-5 text-sm leading-relaxed text-[#F1F5F9]/80">
          <p>Fall Armyworm (Spodoptera frugiperda) is an invasive pest that can cause up to 100% yield loss in maize if left unchecked.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Identification:</h4>
          <p>Look for egg masses on the underside of leaves covered in a felt-like layer. The caterpillars have four dark spots forming a square on their second-to-last segment, and an inverted Y shape on their head.</p>
          <h4 className="text-lg font-bold text-[#F1F5F9] mt-6 border-b border-[#64748B]/20 pb-2">Control Measures:</h4>
          <ul className="list-disc pl-5 space-y-2 text-[#64748B]">
            <li><strong>Mechanical:</strong> Handpick and destroy egg masses in the early stages (up to 30 days of sowing).</li>
            <li><strong>Biological:</strong> Apply Metarhizium anisopliae or Bacillus thuringiensis (Bt) directly into the leaf whorls.</li>
            <li><strong>Chemical:</strong> If infestation crosses 10%, spray Emamectin benzoate (0.4 g/liter) or Spinetoram (0.5 ml/liter). Ensure the spray nozzle is directed exactly into the whorl of the plant.</li>
          </ul>
        </div>
      )
    },
    // ── MEDIA CONTENT (VIDEO/AUDIO) ──
    {
      id: 7,
      title: "How to identify common Cotton pests early",
      type: "Video",
      duration: "3:45 mins",
      category: "Crop Health",
      summary: "A visual walkthrough showing the early signs of bollworm and aphid infestations on cotton leaves.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    },
    {
      id: 8,
      title: "Low-cost Drip Irrigation setup & maintenance",
      type: "Video",
      duration: "14:15 mins",
      category: "Water",
      summary: "Step-by-step video blueprint on laying lateral lines, punching emitters, and cleaning filters to prevent salt clogging.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    },
    {
      id: 9,
      title: "Proper Tractor Maintenance Before Sowing Season",
      type: "Video",
      duration: "9:20 mins",
      category: "Machinery",
      summary: "Learn how to check transmission fluids, clean air filters, and grease joints to prevent breakdowns in the middle of the field.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    },
    {
      id: 10,
      title: "Preparing soil for the Rabi season: Nitrogen fixing",
      type: "Audio",
      duration: "5:20 mins",
      category: "Soil Health",
      summary: "Listen to experts discuss why crop rotation with pulses improves soil nitrogen before sowing winter crops like wheat.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    },
    {
      id: 11,
      title: "Weather Forecasting: Timing the Monsoon Sowing",
      type: "Audio",
      duration: "8:10 mins",
      category: "Weather",
      summary: "Audio guide on how to read early monsoon signs and why delaying sowing by just one week can sometimes save your crop from dry spells.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    },
    {
      id: 12,
      title: "Financial Literacy: Mudra Loans for Agri-Business",
      type: "Audio",
      duration: "11:45 mins",
      category: "Govt Schemes",
      summary: "Expand beyond farming. Learn how to secure a Mudra loan to start an agri-processing unit, dairy farm, or poultry business.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    }
  ];

  const formats = ["All Formats", "Read (Guides)", "Videos", "Audio Tips"];

  // ── FILTER & SEARCH LOGIC ──
  const filteredItems = contentItems.filter((item) => {
    // 1. Format filter check
    const matchesFormat = 
      activeFormat === "All Formats" ||
      (activeFormat === "Read (Guides)" && item.type === "Read") ||
      (activeFormat === "Videos" && item.type === "Video") ||
      (activeFormat === "Audio Tips" && item.type === "Audio");

    // 2. Search query check (search in title, category, or summary)
    const matchesSearch = 
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQueryLower) ||
      item.category.toLowerCase().includes(QueryLower) ||
      item.summary.toLowerCase().includes(QueryLower);

    return matchesFormat && matchesSearch;
  });
  
  // Safeguard for safe string lowercasing
  const QueryLower = searchQuery.toLowerCase();

  return (
    <div className="min-h-screen w-screen font-sans bg-[#0A0F1C] text-[#F1F5F9] overflow-x-hidden relative">
      
      {/* ── Navigation Bar ── */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-[#64748B]/15 bg-[#0A0F1C]/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-[#64748B] hover:text-[#10B981] transition-colors mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0F1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Learn</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[#F1F5F9]">Knowledge Hub</h1>
          <p className="text-[#64748B] max-w-xl text-sm leading-relaxed mb-8">
            In-depth field handbooks, quick audio updates, and detailed video tutorials curated for your soil and region.
          </p>

          {/* ── AI Prompt / Search Bar ── */}
          <div className="relative max-w-2xl mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Ask AI assistant: 'How to cure leaf curls in cotton?' or search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#141E30] border border-[#64748B]/30 text-sm placeholder:text-[#64748B] text-[#F1F5F9] focus:outline-none focus:border-[#10B981] transition-colors shadow-inner"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                AI SEARCH
              </span>
            </div>
          </div>
          
          {/* Format Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {formats.map((fmt) => (
              <button 
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                  activeFormat === fmt 
                  ? "bg-[#10B981]/10 border-[#10B981]/50 text-[#10B981]" 
                  : "bg-transparent border-[#64748B]/25 text-[#64748B] hover:border-[#64748B]"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </header>

        {/* Content Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
              Library Materials ({filteredItems.length})
            </h2>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-[#64748B]/20 text-[#64748B] text-sm">
              No results match your prompt/filters. Try clearing the search bar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setActiveItem(item)} 
                  className="group flex flex-col p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15 hover:border-[#10B981]/40 hover:bg-[#16233a] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        item.type === "Read" ? "bg-emerald-500/10 text-emerald-400" :
                        item.type === "Video" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">{item.category}</span>
                    </div>
                    <span className="text-xs text-[#64748B]/80 bg-[#0A0F1C] px-2.5 py-0.5 rounded-full border border-[#64748B]/10 font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-[16px] text-[#F1F5F9] mb-2 group-hover:text-[#10B981] transition-colors leading-snug">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-4">{item.summary}</p>
                  <div className="mt-auto pt-2 border-t border-[#64748B]/10 flex items-center justify-between text-xs font-semibold text-[#64748B]/60 group-hover:text-[#10B981] transition-colors">
                    <span>{item.type === "Read" ? "Open Article" : item.type === "Video" ? "Watch Video" : "Listen Now"}</span>
                    <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── POPUP MODAL OVERLAY ── */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-[#0A0F1C]/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setActiveItem(null)} 
          />
          
          <div className="relative w-full max-w-3xl bg-[#141E30] border border-[#64748B]/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#64748B]/15 bg-[#141E30]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
                <span className={`w-2 h-2 rounded-full ${
                  activeItem.type === "Read" ? "bg-emerald-500" : activeItem.type === "Video" ? "bg-blue-500" : "bg-amber-500"
                }`} />
                {activeItem.category} {activeItem.type}
              </div>
              <button 
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#64748B]/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-8 leading-tight">{activeItem.title}</h2>

              {/* Layout for VIDEO */}
              {activeItem.type === "Video" && (
                <div className="w-full aspect-video bg-[#0A0F1C] rounded-xl flex items-center justify-center border border-[#64748B]/20 group cursor-pointer relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:via-black/40 transition-colors" />
                   
                   <div className="w-20 h-20 rounded-full bg-[#10B981] text-[#0A0F1C] flex items-center justify-center z-10 transform group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.3)] pl-1.5">
                     <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                   </div>
                   
                   <div className="absolute bottom-6 left-6 z-10">
                      <p className="text-sm font-semibold text-white mb-1">{activeItem.title}</p>
                      <p className="text-xs text-white/60">Duration: {activeItem.duration}</p>
                   </div>
                </div>
              )}

              {/* Layout for AUDIO */}
              {activeItem.type === "Audio" && (
                <div className="w-full bg-[#0A0F1C] border border-[#64748B]/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                  <button className="w-16 h-16 rounded-full bg-[#10B981] text-[#0A0F1C] flex items-center justify-center hover:scale-105 transition-transform pl-1.5 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </button>
                  <div className="flex-1 w-full">
                    <p className="text-sm font-semibold text-[#F1F5F9] mb-3 text-center sm:text-left">Playing: {activeItem.title}</p>
                    <div className="flex justify-between text-xs text-[#64748B] mb-2 font-medium">
                      <span>0:00</span>
                      <span>{activeItem.duration}</span>
                    </div>
                    {/* Fake progress bar */}
                    <div className="w-full h-2 bg-[#64748B]/20 rounded-full overflow-hidden cursor-pointer group">
                      <div className="w-1/4 h-full bg-[#10B981] rounded-full relative group-hover:bg-emerald-400 transition-colors">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout for READ / ARTICLE */}
              {activeItem.type === "Read" && (
                 <div className="prose prose-invert max-w-none">
                    {activeItem.fullContent ? activeItem.fullContent : (
                      <p className="text-[#64748B] italic">Content coming soon...</p>
                    )}
                 </div>
              )}

              {/* Share / Save Actions Footer */}
              <div className="mt-10 pt-6 border-t border-[#64748B]/15 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#F1F5F9] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  Save to offline library
                </button>
                <button className="flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:text-emerald-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share via WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}