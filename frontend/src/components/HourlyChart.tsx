import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyForecast } from '../types/weather';
import type { TemperatureUnit } from '../types/weather';
import { convertTemp, formatHour } from '../utils/weatherUtils';

interface Props {
  hourly: HourlyForecast[];
  unit: TemperatureUnit;
  timezone: number;
}

interface ChartEntry {
  time: string;
  temp: number;
  pop: number;
  humidity: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-time">{label}</p>
      <p className="tooltip-temp">{payload[0]?.value}°</p>
      {payload[1]?.value > 0 && (
        <p className="tooltip-pop">💧 {payload[1].value}%</p>
      )}
    </div>
  );
}

export default function HourlyChart({ hourly, unit, timezone }: Props) {
  const data: ChartEntry[] = hourly.map((h) => ({
    time: formatHour(h.dt, timezone),
    temp: convertTemp(h.temp, unit),
    pop: h.pop,
    humidity: h.humidity,
  }));

  return (
    <div className="hourly-chart-card">
      <h2 className="section-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        24-Hour Temperature
      </h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temp"
              stroke="#60A5FA"
              strokeWidth={2.5}
              fill="url(#tempGrad)"
              dot={{ fill: '#60A5FA', r: 3 }}
              activeDot={{ r: 5, fill: '#BFDBFE' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly scroll strip */}
      <div className="hourly-strip">
        {hourly.map((h, i) => (
          <div key={i} className="hourly-item">
            <span className="hourly-time">{formatHour(h.dt, timezone)}</span>
            <span className="hourly-temp">{convertTemp(h.temp, unit)}°</span>
            {h.pop > 0 && <span className="hourly-pop">💧{h.pop}%</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
