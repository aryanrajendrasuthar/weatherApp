import React from 'react';

interface Props {
  conditionId: number;
  icon: string; // OWM icon code e.g. "01d"
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = { sm: 32, md: 56, lg: 96, xl: 140 };

function isNight(icon: string) {
  return icon.endsWith('n');
}

export default function WeatherIcon({ conditionId, icon, size = 'md' }: Props) {
  const px = SIZE_MAP[size];
  const night = isNight(icon);

  // Thunderstorm
  if (conditionId >= 200 && conditionId < 300) {
    return (
      <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Thunderstorm">
        <style>{`
          @keyframes cloudDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
          @keyframes lightning { 0%,90%,100%{opacity:1} 92%,98%{opacity:0.1} }
          .cloud-drift { animation: cloudDrift 3s ease-in-out infinite; }
          .lightning { animation: lightning 2.5s ease-in-out infinite; }
        `}</style>
        <g className="cloud-drift">
          <ellipse cx="50" cy="38" rx="28" ry="16" fill="#78909C" />
          <ellipse cx="35" cy="44" rx="15" ry="12" fill="#607D8B" />
          <ellipse cx="65" cy="44" rx="15" ry="12" fill="#607D8B" />
          <rect x="35" y="50" width="30" height="12" rx="4" fill="#607D8B" />
        </g>
        <g className="lightning">
          <polygon points="50,55 43,72 49,72 44,88 58,68 51,68 56,55" fill="#FFD600" />
        </g>
      </svg>
    );
  }

  // Rain / Drizzle
  if (conditionId >= 300 && conditionId < 600) {
    return (
      <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Rain">
        <style>{`
          @keyframes rainFall { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(18px);opacity:0} }
          .rain1 { animation: rainFall 1.1s linear infinite; }
          .rain2 { animation: rainFall 1.1s linear 0.35s infinite; }
          .rain3 { animation: rainFall 1.1s linear 0.7s infinite; }
          .cloud-drift { animation: cloudDrift 3s ease-in-out infinite; }
          @keyframes cloudDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
        `}</style>
        <g className="cloud-drift">
          <ellipse cx="50" cy="38" rx="26" ry="14" fill="#90A4AE" />
          <ellipse cx="36" cy="43" rx="14" ry="11" fill="#78909C" />
          <ellipse cx="64" cy="43" rx="14" ry="11" fill="#78909C" />
          <rect x="36" y="48" width="28" height="10" rx="4" fill="#78909C" />
        </g>
        <g className="rain1">
          <line x1="35" y1="62" x2="30" y2="74" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="rain2">
          <line x1="50" y1="62" x2="45" y2="74" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="rain3">
          <line x1="65" y1="62" x2="60" y2="74" stroke="#4FC3F7" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Snow
  if (conditionId >= 600 && conditionId < 700) {
    return (
      <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Snow">
        <style>{`
          @keyframes snowFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(16px) rotate(180deg);opacity:0} }
          .snow1 { animation: snowFall 1.6s linear infinite; }
          .snow2 { animation: snowFall 1.6s linear 0.5s infinite; }
          .snow3 { animation: snowFall 1.6s linear 1s infinite; }
        `}</style>
        <ellipse cx="50" cy="38" rx="26" ry="14" fill="#B0BEC5" />
        <ellipse cx="36" cy="43" rx="14" ry="11" fill="#90A4AE" />
        <ellipse cx="64" cy="43" rx="14" ry="11" fill="#90A4AE" />
        <rect x="36" y="48" width="28" height="10" rx="4" fill="#90A4AE" />
        <g className="snow1">
          <circle cx="36" cy="66" r="3" fill="white" />
        </g>
        <g className="snow2">
          <circle cx="50" cy="66" r="3" fill="white" />
        </g>
        <g className="snow3">
          <circle cx="64" cy="66" r="3" fill="white" />
        </g>
      </svg>
    );
  }

  // Atmosphere (mist/fog/haze)
  if (conditionId >= 700 && conditionId < 800) {
    return (
      <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Mist">
        <style>{`
          @keyframes mistFade { 0%,100%{opacity:0.5} 50%{opacity:1} }
          .mist { animation: mistFade 2.5s ease-in-out infinite; }
        `}</style>
        <g className="mist">
          <rect x="15" y="35" width="70" height="8" rx="4" fill="#B0BEC5" opacity="0.8" />
          <rect x="20" y="50" width="60" height="8" rx="4" fill="#B0BEC5" opacity="0.7" />
          <rect x="15" y="65" width="70" height="8" rx="4" fill="#B0BEC5" opacity="0.6" />
        </g>
      </svg>
    );
  }

  // Clear sky
  if (conditionId === 800) {
    if (night) {
      return (
        <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Clear night">
          <style>{`
            @keyframes moonGlow { 0%,100%{filter:drop-shadow(0 0 6px rgba(255,236,153,0.6))} 50%{filter:drop-shadow(0 0 14px rgba(255,236,153,0.9))} }
            .moon { animation: moonGlow 3s ease-in-out infinite; }
          `}</style>
          <g className="moon">
            <circle cx="52" cy="50" r="22" fill="#FFF9C4" />
            <circle cx="62" cy="40" r="18" fill="#37474F" />
          </g>
          <circle cx="20" cy="22" r="2" fill="white" opacity="0.9" />
          <circle cx="75" cy="18" r="1.5" fill="white" opacity="0.7" />
          <circle cx="85" cy="35" r="1" fill="white" opacity="0.8" />
          <circle cx="15" cy="70" r="1.5" fill="white" opacity="0.6" />
          <circle cx="82" cy="72" r="1" fill="white" opacity="0.7" />
        </svg>
      );
    }
    return (
      <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Sunny">
        <style>{`
          @keyframes sunSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes sunPulse { 0%,100%{opacity:0.8} 50%{opacity:1} }
          .sun-rays { transform-origin:50px 50px; animation: sunSpin 12s linear infinite; }
          .sun-glow { animation: sunPulse 2s ease-in-out infinite; }
        `}</style>
        <g className="sun-rays">
          {[0,45,90,135,180,225,270,315].map((deg, i) => (
            <line
              key={i}
              x1={50 + 28 * Math.cos((deg * Math.PI) / 180)}
              y1={50 + 28 * Math.sin((deg * Math.PI) / 180)}
              x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
              y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
              stroke="#FFB300"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </g>
        <circle className="sun-glow" cx="50" cy="50" r="22" fill="#FFD600" />
        <circle cx="50" cy="50" r="18" fill="#FFEB3B" />
      </svg>
    );
  }

  // Cloudy (conditionId > 800)
  return (
    <svg width={px} height={px} viewBox="0 0 100 100" aria-label="Cloudy">
      <style>{`
        @keyframes cloudDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        .cloud-front { animation: cloudDrift 4s ease-in-out infinite; }
        .cloud-back { animation: cloudDrift 4s ease-in-out 1s infinite; }
      `}</style>
      {!night && <circle cx="30" cy="42" r="16" fill="#FFD600" opacity="0.6" />}
      <g className="cloud-back" opacity="0.7">
        <ellipse cx="58" cy="42" rx="20" ry="12" fill="#B0BEC5" />
        <ellipse cx="44" cy="48" rx="12" ry="10" fill="#90A4AE" />
      </g>
      <g className="cloud-front">
        <ellipse cx="46" cy="54" rx="24" ry="14" fill="#CFD8DC" />
        <ellipse cx="32" cy="60" rx="14" ry="12" fill="#B0BEC5" />
        <ellipse cx="62" cy="60" rx="14" ry="12" fill="#B0BEC5" />
        <rect x="32" y="65" width="30" height="10" rx="4" fill="#B0BEC5" />
      </g>
    </svg>
  );
}
