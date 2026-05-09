import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeather';
import DetailCards from './components/DetailCards';
import HourlyChart from './components/HourlyChart';
import ForecastCards from './components/ForecastCards';
import RecentCities from './components/RecentCities';
import { useWeather, useGeolocation } from './hooks/useWeather';
import { getBackgroundClass } from './utils/weatherUtils';
import type { TemperatureUnit } from './types/weather';

export default function App() {
  const { current, forecast, loading, error, fetchWeather, clearError } = useWeather();
  const { getLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [refreshKey, setRefreshKey] = useState(0);
  const hasAutoLocated = useRef(false);

  // Auto-detect location on first load
  useEffect(() => {
    if (hasAutoLocated.current) return;
    hasAutoLocated.current = true;
    getLocation((lat, lon) => fetchWeather(lat, lon));
  }, [getLocation, fetchWeather]);

  function handleCitySelect(lat: number, lon: number) {
    fetchWeather(lat, lon);
  }

  function handleGeolocate() {
    getLocation((lat, lon) => fetchWeather(lat, lon));
  }

  function handleFavoriteToggle() {
    setRefreshKey((k) => k + 1);
  }

  const bgClass = current
    ? getBackgroundClass(current.conditionId, current.dt, current.sunrise, current.sunset)
    : 'bg-default';

  const combinedError = error || geoError;

  return (
    <div className={`app ${bgClass}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="brand-icon">
              <circle cx="12" cy="12" r="5" fill="#FFD600" />
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <line
                  key={i}
                  x1={12 + 7 * Math.cos((deg * Math.PI) / 180)}
                  y1={12 + 7 * Math.sin((deg * Math.PI) / 180)}
                  x2={12 + 10 * Math.cos((deg * Math.PI) / 180)}
                  y2={12 + 10 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#FFD600"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <span className="brand-name">WeatherNow</span>
          </div>
          <SearchBar
            onSelect={(lat, lon, name, country) => {
              handleCitySelect(lat, lon);
            }}
            onGeolocate={handleGeolocate}
            geoLoading={geoLoading}
          />
        </div>
      </header>

      <main className="app-main">
        {/* Recent / Favorite Cities */}
        <RecentCities
          onSelect={(lat, lon) => handleCitySelect(lat, lon)}
          refreshKey={refreshKey}
        />

        {/* Error Banner */}
        {combinedError && (
          <div className="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{combinedError}</span>
            <button onClick={clearError} className="error-close" aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {/* Welcome Screen */}
        {!loading && !current && !combinedError && (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg width="80" height="80" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="22" fill="#FFD600" />
                <circle cx="50" cy="50" r="18" fill="#FFEB3B" />
                {[0,45,90,135,180,225,270,315].map((deg, i) => (
                  <line
                    key={i}
                    x1={50 + 28 * Math.cos((deg * Math.PI) / 180)}
                    y1={50 + 28 * Math.sin((deg * Math.PI) / 180)}
                    x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#FFB300"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            </div>
            <h2>Welcome to WeatherNow</h2>
            <p>Allow location access or search for any city to get started.</p>
            <button className="cta-button" onClick={handleGeolocate} disabled={geoLoading}>
              {geoLoading ? 'Locating…' : '📍 Use My Location'}
            </button>
          </div>
        )}

        {/* Main Weather Content */}
        {!loading && current && forecast && (
          <div className="weather-content">
            <div className="main-col">
              <CurrentWeatherCard
                weather={current}
                unit={unit}
                onToggleUnit={() => setUnit((u) => (u === 'C' ? 'F' : 'C'))}
                onFavoriteToggle={handleFavoriteToggle}
              />
              <DetailCards weather={current} />
              <HourlyChart hourly={forecast.hourly} unit={unit} timezone={current.timezone} />
            </div>
            <div className="side-col">
              <ForecastCards daily={forecast.daily} unit={unit} />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>Powered by OpenWeatherMap · WeatherNow &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
