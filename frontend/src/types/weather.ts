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
  cached?: boolean;
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
  cached?: boolean;
}

export interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type TemperatureUnit = 'C' | 'F';

export type WeatherCondition =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist'
  | 'Smoke'
  | 'Haze'
  | 'Dust'
  | 'Fog'
  | 'Sand'
  | 'Ash'
  | 'Squall'
  | 'Tornado';

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
