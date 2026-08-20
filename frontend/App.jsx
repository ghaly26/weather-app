import React, { useState, useEffect } from 'react';

// This automatically handles switching between your live Vercel URL and your local computer link
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // 1. Fetch suggestions as the user types prefix letters
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // Routed through your backend to keep your API keys hidden and safe!
        const res = await fetch(`${BACKEND_URL}/api/suggestions?query=${query}`);
        if (!res.ok) throw new Error("Could not fetch suggestions");
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300); // Waits 300ms after user stops typing to save API calls

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // 2. Fetch final weather results
  const fetchWeather = async (cityName) => {
    setError('');
    setWeather(null);
    setSuggestions([]);
    try {
      // Clean dynamic fetch line that works on localhost and live servers
      const res = await fetch(`${BACKEND_URL}/api/weather?city=${cityName}`);
      if (!res.ok) throw new Error("City not found or server error");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ background: '#0d1326', color: 'white', minHeight: '100vh', padding: '40px' }}>
      <h2>STATION REPORT</h2>
      <h1>Weather</h1>

      <div style={{ position: 'relative', width: '300px', margin: '0 auto' }}>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city..."
            style={{ padding: '10px', width: '100%', background: '#1a233d', color: 'white', border: '1px solid #334155' }}
          />
          <button onClick={() => fetchWeather(query)} style={{ padding: '10px', background: 'transparent', border: '1px solid #e2b43b', color: '#e2b43b', cursor: 'pointer' }}>
            CHECK
          </button>
        </div>

        {/* Suggestions Dropdown Overlay */}
        {suggestions.length > 0 && (
          <ul style={{ position: 'absolute', width: '100%', background: '#1a233d', border: '1px solid #334155', listStyle: 'none', padding: 0, margin: 0, textAlign: 'left', zIndex: 10 }}>
            {suggestions.map((city, idx) => (
              <li 
                key={idx} 
                onClick={() => {
                  setQuery(`${city.name}, ${city.country}`);
                  fetchWeather(city.name);
                }}
                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #2d3748' }}
              >
                {city.name}, {city.state ? `${city.state}, ` : ''}{city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error Message Section */}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {/* Weather Results Section */}
      {weather && (
        <div style={{ marginTop: '30px', border: '1px solid #334155', padding: '20px', display: 'inline-block', background: '#1a233d' }}>
          <h3>{weather.name}, {weather.sys.country}</h3>
          <h2>{Math.round(weather.main.temp)}°C</h2>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;