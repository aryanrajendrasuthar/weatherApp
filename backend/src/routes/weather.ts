import { Router, Request, Response } from 'express';
import Redis from 'ioredis';
import {
  fetchCurrentWeather,
  fetchForecast,
  searchCities,
} from '../services/weatherService';

const router = Router();

// Optional Redis client — app works without Redis
let redis: Redis | null = null;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    connectTimeout: 2000,
    maxRetriesPerRequest: 1,
  });
  redis.on('error', () => {
    redis = null; // Disable Redis on connection failure
  });
} catch {
  redis = null;
}

async function getCache(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

async function setCache(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    // Ignore cache write errors
  }
}

// GET /api/weather/current?lat=&lon=
router.get('/current', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }

  const latNum = parseFloat(lat as string);
  const lonNum = parseFloat(lon as string);
  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers' });
  }

  const cacheKey = `weather:current:${latNum.toFixed(2)}:${lonNum.toFixed(2)}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ ...JSON.parse(cached), cached: true });
    }

    const data = await fetchCurrentWeather(latNum, lonNum);
    await setCache(cacheKey, JSON.stringify(data), 300); // 5-min TTL
    return res.json(data);
  } catch (err: any) {
    console.error('Error fetching current weather:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to fetch weather data' });
  }
});

// GET /api/weather/forecast?lat=&lon=
router.get('/forecast', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }

  const latNum = parseFloat(lat as string);
  const lonNum = parseFloat(lon as string);
  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ error: 'lat and lon must be valid numbers' });
  }

  const cacheKey = `weather:forecast:${latNum.toFixed(2)}:${lonNum.toFixed(2)}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ ...JSON.parse(cached), cached: true });
    }

    const data = await fetchForecast(latNum, lonNum);
    await setCache(cacheKey, JSON.stringify(data), 900); // 15-min TTL
    return res.json(data);
  } catch (err: any) {
    console.error('Error fetching forecast:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to fetch forecast data' });
  }
});

// GET /api/weather/search?q=
router.get('/search', async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || (q as string).trim().length < 2) {
    return res.status(400).json({ error: 'Query param q must be at least 2 characters' });
  }

  const cacheKey = `weather:search:${(q as string).toLowerCase().trim()}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const results = await searchCities((q as string).trim());
    await setCache(cacheKey, JSON.stringify(results), 3600); // 1-hour TTL
    return res.json(results);
  } catch (err: any) {
    console.error('Error searching cities:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to search cities' });
  }
});

export default router;
