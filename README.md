# Kisaan-Mitra

**[Live Deployment Link](https://kisaan-mitra-ashen.vercel.app/)**

Kisaan Mitra is a context-aware, multimodal AI-powered agricultural companion designed to empower farmers. By bridging the gap between traditional farming and modern data-driven agriculture, we provide real-time telemetry, AI crop diagnostics, and market intelligence to help farmers make proactive, high-yield decisions.

---

## Features & What We Built Together
* **Kisaan Mitra AI helper:** Talk to the gemini based AI assistant for any queries related to farming. Supports many regional languages as well.

* **AI Agriculture Scanner:** A unified camera and upload interface where farmers can snap photos of their crops. Powered by Gemini Multimodal AI, it detects diseases, pest infestations, and nutrient deficiencies, providing localized, actionable remedies.

* **Interactive Knowledge Hub:** A searchable, endless resource library. If a guide doesn't exist, the AI engine dynamically generates a perfectly formatted, step-by-step agricultural handbook on the fly.

* **Automated Task Manager:** A database-connected agronomic task scheduler that helps farmers track their sowing, fertilizing, and harvesting cycles.
* **Floating AI Assistant:** A persistent, context-aware chatbot available across the dashboard to answer quick questions about farming practices, loans, and weather.

* **Secure Authentication:** Seamless Google OAuth login flow using NextAuth securely persisted in MongoDB.

* **Real-Time Telemetry Dashboard:** A beautifully designed Farm Command Center featuring live weather forecasting, simulated satellite soil sensor data (N-P-K levels, moisture), and financial/yield analytics visualized with Recharts. Currently not functional.

* **Smart Mandi Tracker:** An intelligent AI assistant that estimates wholesale market prices for specific crops in the user's localized region based on current agronomic trends. Currently not functional.

---

## Tech Stack & Packages

Built on the modern **Next.js 16 (App Router)** and **React 19** ecosystem. 

**Core Dependencies:**
* `@google/genai` (^2.10.0) - Core multimodal AI reasoning engine.
* `next-auth` (^4.24.14) & `@next-auth/mongodb-adapter` (^1.1.3) - Authentication framework.
* `mongodb` (^7.4.0) - NoSQL database for user profiles and tasks.
* `recharts` (^3.9.0) - Interactive charting for yield and operational costs.
* `framer-motion` (^12.42.0) - Fluid animations and modal transitions.
* `react-markdown` (^10.1.0) - Secure, elegant parsing of AI-generated Markdown.
* `lucide-react` (^1.21.0) - Beautiful, scalable UI icons.
* `tailwindcss` (^4.0.0) via `@tailwindcss/postcss` (^4.3.1) - Styling and UI consistency.
* `babel-plugin-react-compiler` (^1.0.0) & `react-is` (^19.2.7) - Build optimizations.

---

## Setup Instructions

Follow these steps to run the project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/unclePRO/kisaan-mitra

# 2. Navigate into the project directory
cd kisaan-mitra

# 3. Install dependencies 
# (Note: Using legacy-peer-deps to resolve upstream MongoDB adapter conflicts)
npm install --legacy-peer-deps

# 4. Set up Environment Variables
# Create a .env.local file in the root directory and add your credentials:
# MONGODB_URI=your_mongodb_connection_string
# GOOGLE_GENAI_API_KEY=your_gemini_api_key
# NEXTAUTH_SECRET=your_random_secret_string
# NEXTAUTH_URL=http://localhost:3000

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

---

## The Team

This ecosystem was built collaboratively by:

* [**unclePRO**](https://github.com/unclePRO)
* [**krishnarajputnan**](https://github.com/krishnarajputnan)
* [**mayank1418**](https://github.com/mayank1418)
* [**Arnavpola**](https://github.com/Arnavpola)