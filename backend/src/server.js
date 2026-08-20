import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable CORS so your live Vercel frontend can talk to your Render backend
app.use(cors()); 
app.use(express.json());

// 1. WEATHER DATA ENDPOINT
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  try {
    // FIXED URL: Added the correct OpenWeatherMap data path
    const response = await fetch(`https://openweathermap.org{encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    const data = await response.json();

    if (response.ok) {
      // Formatted precisely to match your frontend weather.weather.description call
      res.json({
        name: data.name,
        sys: { country: data.sys.country },
        main: { 
          temp: data.main.temp, 
          humidity: data.main.humidity 
        },
        weather: { 
          description: data.weather && data.weather[0] ? data.weather[0].description : "No description" 
        }
      });
    } else {
      res.status(response.status).json({ message: data.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching weather data" });
  }
});

// 2. PREFIX SEARCH ENDPOINT (Suggestions Dropdown)
app.get('/api/suggestions', async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.WEATHER_API_KEY; 
  
  try {
    // FIXED URL: Added the correct OpenWeatherMap geocoding path
    const response = await fetch(`https://openweathermap.org{encodeURIComponent(query)}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));