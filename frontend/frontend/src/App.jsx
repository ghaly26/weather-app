import React, { useState } from 'react';
import { CloudRain, Compass, Thermometer, Droplets } from 'lucide-react';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // 🔗 Points directly to your live Render backend endpoint
      const response = await fetch(`https://onrender.com{city}`);
      
      if (!response.ok) {
        throw new Error('City not found or server error');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#111622', color: '#ffffff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Header section matching your screenshot template */}
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '30px' }}>
        <p style={{ color: '#D4AF37', fontSize: '12px', letterSpacing: '2px', fontWeight: 'bold', margin: '0 0 5px 0' }}>STATION REPORT</p>
        <h1 style={{ fontSize: '42px', margin: '0 0 30px 0', fontWeight: 'normal' }}>Weather</h1>
        
        {/* Search input form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="tokyo" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1, backgroundColor: '#172237', border: '1px solid #233554', padding: '15px', color: '#fff', borderRadius: '4px', fontSize: '16px' }}
          />
          <button 
            type="submit" 
            style={{ backgroundColor: '#172237', border: '1px solid #D4AF37', color: '#D4AF37', padding: '0 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {loading ? '...' : 'CHECK'}
          </button>
        </form>
        {error && <p style={{ color: '#ff4a4a', marginTop: '10px' }}>{error}</p>}
      </div>

      {/* Main interactive weather panel layout */}
      {weatherData && (
        <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#172237', borderRadius: '8px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', position: 'relative' }}>
            <div>
              <span style={{ color: '#64ffda', fontSize: '12px', fontWeight: 'bold' }}>{weatherData.country || 'JP'}</span>
              <h2 style={{ fontSize: '36px', margin: '5px 0 20px 0' }}>{weatherData.name}</h2>
            </div>
            <div style={{ position: 'absolute', right: '0', top: '0', color: '#D4AF37' }}>
              <CloudRain size={48} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', margin: '20px 0' }}>
            <span style={{ fontSize: '96px', fontWeight: '300', lineHeight: '1' }}>{Math.round(weatherData.temp)}</span>
            <span style={{ fontSize: '48px', fontWeight: '300', alignSelf: 'start', marginTop: '10px' }}>°</span>
            <span style={{ fontSize: '16px', color: '#8892b0', marginLeft: '20px' }}>{weatherData.description}</span>
          </div>

          {/* Compass Dashboard element */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderTop: '1px solid #233554', paddingTop: '20px', marginBottom: '20px' }}>
            <div style={{ color: '#8892b0' }}><Compass size={48} /></div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}><span style={{ color: '#D4AF37' }}>{weatherData.windSpeed}</span> km/h</div>
              <div style={{ fontSize: '14px', color: '#8892b0' }}>{weatherData.windDir} • {weatherData.windAngle}°</div>
            </div>
          </div>

          {/* Extra modular detail boxes at footer */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1, backgroundColor: '#111622', padding: '15px', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#8892b0', marginBottom: '5px' }}>FEELS LIKE</div>
              <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}><Thermometer size={16} /> {Math.round(weatherData.feelsLike)}°</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#111622', padding: '15px', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', color: '#8892b0', marginBottom: '5px' }}>HUMIDITY</div>
              <div style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px' }}><Droplets size={16} /> {weatherData.humidity}%</div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;