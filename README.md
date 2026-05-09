# WeatherNow 🌤️

A premium real-time weather dashboard — **Project 9** from the Portfolio Master Plan.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## Features

| Feature | Details |
|---|---|
| 📍 Auto-location | Geolocation API detects your city on load |
| 🔍 City search | Autocomplete with 500ms debounce via OpenWeatherMap Geocoding |
| 🌡️ Unit toggle | Switch between °C and °F instantly |
| 🎨 Dynamic backgrounds | Gradient changes based on weather condition + day/night |
| ⭐ Favorites & Recent | Pin cities to favorites; last 5 searches remembered in localStorage |
| 📊 Hourly chart | Recharts AreaChart — 24-hour temperature trend |
| 📅 5-Day Forecast | Daily high/low with proportional range bar |
| 💨 Detail cards | Humidity, Wind Speed, Visibility, Pressure |
| 🕐 Sunrise / Sunset | Times adjusted to local timezone |
| ⚡ Redis caching | Current weather cached 5 min; forecast 15 min |
| 🔒 API key hidden | Express proxy keeps your API key server-side |
| 🐳 Docker | One-command deployment with Docker Compose |

---

## Architecture

```
┌────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│   React Frontend   │──────▶│  Express Proxy (3001) │──────▶│  OpenWeatherMap API │
│  Vite + TypeScript │  /api │  Node.js + TypeScript │       │  (free tier)        │
│     port 5173      │       │                      │       └─────────────────────┘
└────────────────────┘       │  ┌────────────────┐  │
                             │  │  Redis Cache   │  │
                             │  │  5-min / 15-min│  │
                             │  └────────────────┘  │
                             └──────────────────────┘
```

---

## Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- Recharts — hourly temperature AreaChart
- Custom SVG animated weather icons
- CSS glassmorphism + dynamic gradient backgrounds
- localStorage for favorites & recent cities

**Backend**
- Node.js + Express.js TypeScript proxy
- ioredis — optional Redis caching (app works without Redis)
- OpenWeatherMap free tier APIs

**Infrastructure**
- Docker + Docker Compose (Redis + Backend + Nginx-served Frontend)

---

## Quick Start

### Prerequisites
- Node.js 18+
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/weatherApp.git
cd weatherApp
```

### 2. Configure environment

```bash
# Create backend env file
cp backend/.env.example backend/.env
# Edit backend/.env and add your API key:
# OPENWEATHER_API_KEY=your_key_here
```

### 3. Run (development)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
# Server starts at http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

> The Vite dev server proxies `/api/*` to `localhost:3001` automatically.

---

## Docker Deployment

```bash
# Copy and configure env
cp .env.example .env
# Edit .env: OPENWEATHER_API_KEY=your_key_here

# Build and run all services
docker compose up --build

# App available at http://localhost:8080
```

Services started:
- `redis` — Redis 7 cache on port 6379
- `backend` — Express proxy on port 3001
- `frontend` — Nginx serving React build on port 8080

---

## API Endpoints

| Endpoint | Description | Cache TTL |
|---|---|---|
| `GET /api/weather/current?lat=&lon=` | Current weather for coordinates | 5 min |
| `GET /api/weather/forecast?lat=&lon=` | 5-day/3-hour forecast | 15 min |
| `GET /api/weather/search?q=` | City geocoding search | 60 min |
| `GET /health` | Backend health check | — |

---

## Project Structure

```
weatherApp/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/weather.ts     # API routes + Redis caching
│   │   └── services/weatherService.ts  # OpenWeatherMap calls
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherIcon.tsx   # Animated SVG weather icons
│   │   │   ├── SearchBar.tsx     # Autocomplete search + geolocation
│   │   │   ├── CurrentWeather.tsx # Hero weather card
│   │   │   ├── DetailCards.tsx   # Humidity/wind/visibility/pressure
│   │   │   ├── HourlyChart.tsx   # Recharts AreaChart + hourly strip
│   │   │   ├── ForecastCards.tsx # 5-day forecast with range bars
│   │   │   └── RecentCities.tsx  # Favorites & recent city chips
│   │   ├── hooks/useWeather.ts   # Weather + geolocation hooks
│   │   ├── services/api.ts       # Axios API client
│   │   ├── types/weather.ts      # TypeScript interfaces
│   │   ├── utils/weatherUtils.ts # Temp conversion, formatting
│   │   ├── App.tsx
│   │   └── index.css             # Full glassmorphism design system
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Notes

- **UV Index**: The free OpenWeatherMap tier does not include UV index in the 5-day forecast endpoint. UV data requires the One Call API 3.0 (paid). Visibility, Pressure, Humidity, and Wind are shown instead.
- **7-day forecast**: The free forecast endpoint returns up to 5 days of data at 3-hour intervals. The app aggregates these into daily cards.
- **Redis is optional**: The backend gracefully falls back to no caching if Redis is unavailable.

---

## 4-Phase Build Summary

| Phase | Focus | Status |
|---|---|---|
| 1 | Express proxy, Redis caching, OpenWeatherMap integration | ✅ |
| 2 | React core UI, geolocation, city search, unit toggle | ✅ |
| 3 | Hourly chart (Recharts), animated SVG icons, detail cards | ✅ |
| 4 | Dynamic backgrounds, favorites/recent cities, Docker, README | ✅ |
