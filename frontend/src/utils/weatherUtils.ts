import type { TemperatureUnit } from '../types/weather';

export function toF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  return unit === 'F' ? toF(celsius) : celsius;
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  return `${convertTemp(celsius, unit)}°${unit}`;
}

export function formatTime(unixTs: number, timezone: number): string {
  const date = new Date((unixTs + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${ampm}`;
}

export function formatHour(unixTs: number, timezone: number): string {
  const date = new Date((unixTs + timezone) * 1000);
  const hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12} ${ampm}`;
}

export function formatDay(unixTs: number): string {
  const date = new Date(unixTs * 1000);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// Determine background gradient class based on weather condition and time of day
export function getBackgroundClass(conditionId: number, dt: number, sunrise: number, sunset: number): string {
  const isNight = dt < sunrise || dt > sunset;
  if (isNight) return 'bg-night';

  if (conditionId >= 200 && conditionId < 300) return 'bg-thunderstorm';
  if (conditionId >= 300 && conditionId < 600) return 'bg-rain';
  if (conditionId >= 600 && conditionId < 700) return 'bg-snow';
  if (conditionId >= 700 && conditionId < 800) return 'bg-mist';
  if (conditionId === 800) return 'bg-clear';
  if (conditionId > 800) return 'bg-cloudy';
  return 'bg-clear';
}

export function getRecentCities(): Array<{ name: string; country: string; lat: number; lon: number }> {
  try {
    return JSON.parse(localStorage.getItem('recentCities') || '[]');
  } catch {
    return [];
  }
}

export function saveRecentCity(city: { name: string; country: string; lat: number; lon: number }): void {
  const recent = getRecentCities().filter(
    (c) => !(Math.abs(c.lat - city.lat) < 0.1 && Math.abs(c.lon - city.lon) < 0.1)
  );
  recent.unshift(city);
  localStorage.setItem('recentCities', JSON.stringify(recent.slice(0, 5)));
}

export function getFavoriteCities(): Array<{ name: string; country: string; lat: number; lon: number }> {
  try {
    return JSON.parse(localStorage.getItem('favoriteCities') || '[]');
  } catch {
    return [];
  }
}

export function toggleFavoriteCity(city: { name: string; country: string; lat: number; lon: number }): boolean {
  const favorites = getFavoriteCities();
  const idx = favorites.findIndex(
    (c) => Math.abs(c.lat - city.lat) < 0.1 && Math.abs(c.lon - city.lon) < 0.1
  );
  if (idx >= 0) {
    favorites.splice(idx, 1);
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    return false;
  } else {
    favorites.unshift(city);
    localStorage.setItem('favoriteCities', JSON.stringify(favorites.slice(0, 10)));
    return true;
  }
}

export function isFavoriteCity(lat: number, lon: number): boolean {
  return getFavoriteCities().some(
    (c) => Math.abs(c.lat - lat) < 0.1 && Math.abs(c.lon - lon) < 0.1
  );
}
