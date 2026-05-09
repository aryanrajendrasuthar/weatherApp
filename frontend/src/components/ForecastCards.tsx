import React from 'react';
import WeatherIcon from './WeatherIcon';
import type { DailyForecast } from '../types/weather';
import type { TemperatureUnit } from '../types/weather';
import { convertTemp, formatDay } from '../utils/weatherUtils';

interface Props {
  daily: DailyForecast[];
  unit: TemperatureUnit;
}

export default function ForecastCards({ daily, unit }: Props) {
  if (!daily.length) return null;

  // Global range for bar scaling
  const globalMin = Math.min(...daily.map((d) => convertTemp(d.tempMin, unit)));
  const globalMax = Math.max(...daily.map((d) => convertTemp(d.tempMax, unit)));
  const range = globalMax - globalMin || 1;

  return (
    <div className="forecast-card">
      <h2 className="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {daily.length}-Day Forecast
      </h2>
      <div className="forecast-list">
        {daily.map((day, i) => {
          const min = convertTemp(day.tempMin, unit);
          const max = convertTemp(day.tempMax, unit);
          const barLeft = ((min - globalMin) / range) * 100;
          const barWidth = ((max - min) / range) * 100;

          return (
            <div key={i} className={`forecast-row ${i === 0 ? 'forecast-today' : ''}`}>
              <span className="forecast-day">{formatDay(day.dt)}</span>

              <div className="forecast-icon-wrap">
                <WeatherIcon conditionId={day.conditionId} icon={day.icon} size="sm" />
              </div>

              {day.pop > 0 && (
                <span className="forecast-pop">💧{day.pop}%</span>
              )}
              {day.pop === 0 && <span className="forecast-pop" />}

              <div className="forecast-bar-area">
                <span className="forecast-temp-min">{min}°</span>
                <div className="forecast-bar-track">
                  <div
                    className="forecast-bar-fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 6)}%`,
                    }}
                  />
                </div>
                <span className="forecast-temp-max">{max}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
