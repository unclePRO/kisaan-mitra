# Kisaan Mitra - Your AI Farmer Friend

Kisaan Mitra (Farmer's Friend) is an AI-powered, mobile-first web application designed to assist local farmers in Banda, Uttar Pradesh, and beyond. It provides hyper-localized farming advice, instant crop disease diagnosis via camera upload, and real-time market (Mandi) and weather data.

## Key Features

- AI Chat Assistant: Ask questions about fertilizers, crop timing, and pest control using text or voice. Powered by Google Gemini.

- Crop Scan Diagnosis: Snap a photo of a diseased leaf to get instant, organic treatment recommendations.

- Real-time Dashboard: Live local weather forecasts and Mandi (market) crop prices.

- Micro-Learning: Quick, seasonal audio and visual tutorials on modern farming techniques.

- Localized Profiles: Tailor advice based on the farmer's specific language (Hindi/English), region, and primary crops.

## Tech Stack

- Frontend: Next.js (App Router), React, Tailwind CSS (Plain JavaScript)

- Backend: Next.js API Routes (Serverless)

- AI Engine: Google Gemini API

- Database: MongoDB

- External APIs: OpenWeatherMap (Weather), [Mandi API Provider] (Market Prices)

## Project Structure & Work Division

To ensure a conflict-free Git workflow, the team is divided into specific zones within the repository using Next.js Route Groups and custom folders:

Dev 1 (AI & Database): Focuses on backend logic, AI prompting, and database integration. Works strictly in app/api/(dev1_ai_backend) and lib/.

Dev 2 (Frontend Layouts): Focuses on mobile-first UI, page layouts, and data display. Works strictly in app/(dev2_frontend_pages).

Dev 3 (Frontend Interactivity): Focuses on interactive elements, state management, and hardware access (camera). Works strictly in dev3_ui_components/ and specific interactive pages.

Dev 4 (Backend APIs): Focuses on fetching external data (weather, prices) and writing API endpoints. Works strictly in app/api/(dev4_api_routes).

## Getting Started (Local Development)

1. Prerequisites

- Node.js (v18 or higher)

- npm or yarn

- A Google Gemini API Key

- A MongoDB Connection URI

2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/[your-repo-link]/kisaan-mitra.git
cd kisaan-mitra
npm install
```


3. Environment Variables

Create a .env.local file in the root directory and add the following keys:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
```

4. Run the Development Server

Start the Next.js development server:

`npm run dev`


Open http://localhost:3000 in your browser to see the application.

## Git Workflow Rules

To avoid merge conflicts during the hackathon, please adhere to the following rules:

Stay in your lane: Only edit files within your designated folder ((dev2_frontend_pages), dev3_ui_components, etc.).

Branching: Create a new branch for every feature (e.g., git checkout -b dev2-dashboard-layout).

Pull Requests: Push your branch and open a PR to main when a feature is complete.

Built with code and care for local agriculture.