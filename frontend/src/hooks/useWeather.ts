import { useState, useCallback } from 'react';
import { getCurrentWeather, getForecast } from '../services/api';
import { saveRecentCity } from '../utils/weatherUtils';
import type { CurrentWeather, ForecastData } from '../types/weather';

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(lat, lon),
        getForecast(lat, lon),
      ]);
      setState({ current, forecast, loading: false, error: null });
      saveRecentCity({ name: current.city, country: current.country, lat, lon });
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to fetch weather data. Check your API key.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { ...state, fetchWeather, clearError };
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(
    (onSuccess: (lat: number, lon: number) => void) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
      }
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(false);
          onSuccess(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          setLoading(false);
          if (err.code === 1) {
            setError('Location access denied. Search for a city instead.');
          } else {
            setError('Unable to retrieve your location.');
          }
        },
        { timeout: 8000 }
      );
    },
    []
  );

  return { getLocation, loading, error, clearError: () => setError(null) };
}
