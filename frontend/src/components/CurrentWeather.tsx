import React from 'react';
import WeatherIcon from './WeatherIcon';
import type { CurrentWeather } from '../types/weather';
import type { TemperatureUnit } from '../types/weather';
import { formatTemp, formatTime, getWindDirection, isFavoriteCity, toggleFavoriteCity } from '../utils/weatherUtils';

interface Props {
  weather: CurrentWeather;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onFavoriteToggle: () => void;
}

export default function CurrentWeatherCard({ weather, unit, onToggleUnit, onFavoriteToggle }: Props) {
  const isFav = isFavoriteCity(weather.lat, weather.lon);

  function handleFav() {
    toggleFavoriteCity({ name: weather.city, country: weather.country, lat: weather.lat, lon: weather.lon });
    onFavoriteToggle();
  }

  return (
    <div className="current-weather-card">
      <div className="current-top">
        <div className="location-row">
          <div className="location-info">
            <h1 className="city-name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pin-icon">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {weather.city}, {weather.country}
            </h1>
            <p className="condition-text">
              {weather.conditionDescription.charAt(0).toUpperCase() + weather.conditionDescription.slice(1)}
            </p>
          </div>
          <div className="action-buttons">
            <button
              className={`fav-button ${isFav ? 'fav-active' : ''}`}
              onClick={handleFav}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFav ? '★' : '☆'}
            </button>
            <button
              className="unit-toggle"
              onClick={onToggleUnit}
              aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
            >
              °C / °F
            </button>
          </div>
        </div>

        <div className="weather-main">
          <div className="temp-display">
            <span className="temp-value">{formatTemp(weather.temp, unit)}</span>
            <span className="temp-range">
              H: {formatTemp(weather.tempMax, unit)} · L: {formatTemp(weather.tempMin, unit)}
            </span>
            <span className="feels-like">Feels like {formatTemp(weather.feelsLike, unit)}</span>
          </div>
          <div className="icon-display">
            <WeatherIcon conditionId={weather.conditionId} icon={weather.icon} size="xl" />
          </div>
        </div>
      </div>

      <div className="sun-row">
        <div className="sun-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <span>Sunrise {formatTime(weather.sunrise, weather.timezone)}</span>
        </div>
        <div className="sun-divider" />
        <div className="sun-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 18a5 5 0 0 0-10 0" />
            <line x1="12" y1="2" x2="12" y2="9" />
            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
            <line x1="1" y1="18" x2="3" y2="18" />
            <line x1="21" y1="18" x2="23" y2="18" />
            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
          </svg>
          <span>Sunset {formatTime(weather.sunset, weather.timezone)}</span>
        </div>
        <div className="sun-divider" />
        <div className="sun-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span>Wind {weather.windSpeed} km/h {getWindDirection(weather.windDeg)}</span>
        </div>
      </div>
    </div>
  );
}
