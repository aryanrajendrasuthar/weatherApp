import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import weatherRouter from './routes/weather';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/weather', weatherRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Weather proxy server running on http://localhost:${PORT}`);
  if (!process.env.OPENWEATHER_API_KEY) {
    console.warn('WARNING: OPENWEATHER_API_KEY is not set. Set it in backend/.env');
  }
});
