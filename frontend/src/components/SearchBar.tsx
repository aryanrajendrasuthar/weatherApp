import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchCities } from '../services/api';
import type { GeoResult } from '../types/weather';

interface Props {
  onSelect: (lat: number, lon: number, name: string, country: string) => void;
  onGeolocate: () => void;
  geoLoading: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar({ onSelect, onGeolocate, geoLoading }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    try {
      const data = await searchCities(q.trim());
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    doSearch(debouncedQuery);
  }, [debouncedQuery, doSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(result: GeoResult) {
    onSelect(result.lat, result.lon, result.name, result.country);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div ref={containerRef} className="search-container">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          aria-label="Search for a city"
          autoComplete="off"
        />
        {searching && (
          <span className="search-spinner" aria-label="Searching" />
        )}
        {query && (
          <button
            className="search-clear"
            onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <button
        className="geo-button"
        onClick={onGeolocate}
        disabled={geoLoading}
        title="Use my location"
        aria-label="Use my location"
      >
        {geoLoading ? (
          <span className="search-spinner" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        )}
      </button>

      {open && results.length > 0 && (
        <ul className="search-dropdown" role="listbox">
          {results.map((r, i) => (
            <li
              key={i}
              className="search-result"
              role="option"
              onClick={() => handleSelect(r)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(r)}
              tabIndex={0}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="result-pin">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span className="result-name">{r.name}</span>
              {r.state && <span className="result-state">{r.state}</span>}
              <span className="result-country">{r.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
