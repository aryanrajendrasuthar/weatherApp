import React from 'react';
import type { CurrentWeather } from '../types/weather';

interface Props {
  weather: CurrentWeather;
}

interface DetailCard {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}

function HumidityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
    </svg>
  );
}
function WindIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function PressureIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="16" y2="10" />
    </svg>
  );
}

function getHumidityLevel(h: number): string {
  if (h < 30) return 'Low';
  if (h < 60) return 'Comfortable';
  if (h < 80) return 'High';
  return 'Very High';
}

function getVisibilityLabel(km: number): string {
  if (km >= 10) return 'Excellent';
  if (km >= 5) return 'Good';
  if (km >= 2) return 'Moderate';
  return 'Poor';
}

function getPressureLabel(hPa: number): string {
  if (hPa < 1000) return 'Low';
  if (hPa < 1020) return 'Normal';
  return 'High';
}

export default function DetailCards({ weather }: Props) {
  const cards: DetailCard[] = [
    {
      label: 'Humidity',
      value: `${weather.humidity}%`,
      sub: getHumidityLevel(weather.humidity),
      icon: <HumidityIcon />,
    },
    {
      label: 'Wind Speed',
      value: `${weather.windSpeed} km/h`,
      sub: `Direction ${weather.windDeg}°`,
      icon: <WindIcon />,
    },
    {
      label: 'Visibility',
      value: `${weather.visibility} km`,
      sub: getVisibilityLabel(weather.visibility),
      icon: <EyeIcon />,
    },
    {
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      sub: getPressureLabel(weather.pressure),
      icon: <PressureIcon />,
    },
  ];

  return (
    <div className="detail-cards-grid">
      {cards.map((card) => (
        <div key={card.label} className="detail-card">
          <div className="detail-icon">{card.icon}</div>
          <div className="detail-info">
            <span className="detail-label">{card.label}</span>
            <span className="detail-value">{card.value}</span>
            {card.sub && <span className="detail-sub">{card.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
