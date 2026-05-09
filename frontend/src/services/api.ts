import axios from 'axios';
import type { CurrentWeather, ForecastData, GeoResult } from '../types/weather';

const api = axios.create({
  baseURL: '/api/weather',
  timeout: 10000,
});

export async function getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const res = await api.get<CurrentWeather>('/current', { params: { lat, lon } });
  return res.data;
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData> {
  const res = await api.get<ForecastData>('/forecast', { params: { lat, lon } });
  return res.data;
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  const res = await api.get<GeoResult[]>('/search', { params: { q: query } });
  return res.data;
}
