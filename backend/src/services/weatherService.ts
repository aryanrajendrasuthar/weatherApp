import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org';
const API_KEY = process.env.OPENWEATHER_API_KEY;

export interface CurrentWeather {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  pressure: number;
  condition: string;
  conditionDescription: string;
  conditionId: number;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
  timezone: number;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionId: number;
  icon: string;
  pop: number;
  humidity: number;
  windSpeed: number;
}

export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionDescription: string;
  conditionId: number;
  icon: string;
  pop: number;
  humidity: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  if (!API_KEY) throw new Error('OPENWEATHER_API_KEY not set');

  const [weatherRes, reverseGeoRes] = await Promise.all([
    axios.get(`${BASE_URL}/data/2.5/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric' },
    }),
    axios.get(`${BASE_URL}/geo/1.0/reverse`, {
      params: { lat, lon, limit: 1, appid: API_KEY },
    }),
  ]);

  const w = weatherRes.data;
  const geo = reverseGeoRes.data[0];

  return {
    city: geo?.name || w.name || 'Unknown',
    country: w.sys.country,
    lat: w.coord.lat,
    lon: w.coord.lon,
    temp: Math.round(w.main.temp),
    feelsLike: Math.round(w.main.feels_like),
    tempMin: Math.round(w.main.temp_min),
    tempMax: Math.round(w.main.temp_max),
    humidity: w.main.humidity,
    windSpeed: Math.round(w.wind.speed * 3.6), // m/s to km/h
    windDeg: w.wind.deg || 0,
    visibility: Math.round((w.visibility || 10000) / 1000), // meters to km
    pressure: w.main.pressure,
    condition: w.weather[0].main,
    conditionDescription: w.weather[0].description,
    conditionId: w.weather[0].id,
    icon: w.weather[0].icon,
    sunrise: w.sys.sunrise,
    sunset: w.sys.sunset,
    dt: w.dt,
    timezone: w.timezone,
  };
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  if (!API_KEY) throw new Error('OPENWEATHER_API_KEY not set');

  const res = await axios.get(`${BASE_URL}/data/2.5/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', cnt: 40 },
  });

  const list = res.data.list as any[];

  // Hourly: next 24 hours (8 data points at 3-hour intervals)
  const hourly: HourlyForecast[] = list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    condition: item.weather[0].main,
    conditionId: item.weather[0].id,
    icon: item.weather[0].icon,
    pop: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
    windSpeed: Math.round((item.wind?.speed || 0) * 3.6),
  }));

  // Daily: aggregate 3-hour entries into days
  const dailyMap = new Map<string, any[]>();
  list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (!dailyMap.has(key)) dailyMap.set(key, []);
    dailyMap.get(key)!.push(item);
  });

  const daily: DailyForecast[] = Array.from(dailyMap.entries()).map(([, items]) => {
    // Pick midday entry for representative condition
    const midday = items[Math.floor(items.length / 2)];
    return {
      dt: midday.dt,
      tempMin: Math.round(Math.min(...items.map((i) => i.main.temp_min))),
      tempMax: Math.round(Math.max(...items.map((i) => i.main.temp_max))),
      condition: midday.weather[0].main,
      conditionDescription: midday.weather[0].description,
      conditionId: midday.weather[0].id,
      icon: midday.weather[0].icon,
      pop: Math.round(Math.max(...items.map((i) => i.pop || 0)) * 100),
      humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
    };
  });

  return { hourly, daily };
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!API_KEY) throw new Error('OPENWEATHER_API_KEY not set');

  const res = await axios.get(`${BASE_URL}/geo/1.0/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });

  return (res.data as any[]).map((item) => ({
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
}
