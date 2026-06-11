# 🏆 FIFA World Cup 2026™ Hub

A premium, interactive web application built to experience the excitement of the 2026 FIFA World Cup. 

Featuring live live-tickers, dynamic tournament brackets, detailed team histories, stadiums overviews, host cities, and an all-time World Cup record book. Built with modern web technologies including React, Vite, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Dynamic Knockout Bracket**: An interactive, beautifully animated tournament tree.
- **Premium Animations**: Powered by Framer Motion, featuring custom trailing cursors, typewriter effects, expanding origin buttons, and staggered reveal animations.
- **Deep Explore Section**:
  - **About 2026**: Tournament format and key facts.
  - **Stadiums & Host Cities**: Immersive grids detailing the 16 venues across 3 nations.
  - **World Cup History**: Past winners, scores, and host nations.
  - **Records**: All-time top scorers, team records, and match records.
- **Live Match Tracking**: Real-time ticker and fixtures pages (simulated with mock data structure).

## 🚀 Getting Started

This project is structured as a monorepo using **pnpm workspaces**. 

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nexus691/Fifa-Hub.git
   cd Fifa-Hub
   ```

2. **Install all dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**
   The project requires a backend API server to scrape and serve football data.
   Navigate to the `artifacts/api-server` directory and create a `.env` file based on `.env.example`:
   ```bash
   cd artifacts/api-server
   # Create a .env file and add your API keys:
   # API_FOOTBALL_KEY=your_key_here (from https://www.api-football.com/)
   # NEWS_API_KEY=your_key_here (from https://newsapi.org/)
   ```

4. **Start the Backend Server**
   ```bash
   # From the artifacts/api-server directory
   pnpm run dev
   ```

5. **Start the Frontend Development Server**
   Open a new terminal, return to the project root, and start the frontend:
   ```bash
   # From the root Fifa-Hub directory
   cd artifacts/fifa-hub
   pnpm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to view the app!

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & shadcn/ui
- **Routing**: wouter
- **Animations**: framer-motion
- **Data Fetching**: @tanstack/react-query
- **Package Manager**: pnpm

## 📝 License
This is a personal/educational project created to celebrate the 2026 World Cup. All trademarks and logos belong to their respective owners.
