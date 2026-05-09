import React from 'react';
import { getRecentCities, getFavoriteCities } from '../utils/weatherUtils';

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface Props {
  onSelect: (lat: number, lon: number, name: string, country: string) => void;
  refreshKey: number;
}

export default function RecentCities({ onSelect, refreshKey }: Props) {
  const recent = getRecentCities();
  const favorites = getFavoriteCities();

  const showFavorites = favorites.length > 0;
  const showRecent = recent.length > 0;

  if (!showFavorites && !showRecent) return null;

  function CityChip({ city, isFav }: { city: City; isFav?: boolean }) {
    return (
      <button
        className={`city-chip ${isFav ? 'city-chip-fav' : ''}`}
        onClick={() => onSelect(city.lat, city.lon, city.name, city.country)}
        title={`${city.name}, ${city.country}`}
      >
        {isFav && <span className="chip-star">★</span>}
        <span className="chip-name">{city.name}</span>
        <span className="chip-country">{city.country}</span>
      </button>
    );
  }

  return (
    <div className="recent-cities-bar">
      {showFavorites && (
        <div className="city-group">
          <span className="city-group-label">Favorites</span>
          <div className="city-chips">
            {favorites.map((c, i) => (
              <CityChip key={i} city={c} isFav />
            ))}
          </div>
        </div>
      )}
      {showRecent && (
        <div className="city-group">
          <span className="city-group-label">Recent</span>
          <div className="city-chips">
            {recent.map((c, i) => (
              <CityChip key={i} city={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
