import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable CORS for all requests
app.use(cors()); 
app.use(express.json());

// Simple endpoint to fetch weather
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHER_API_KEY; // Get your free key from OpenWeatherMap

  try {
    const response = await fetch(`https://openweathermap.org{city}&units=metric&appid=${apiKey}`);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ message: data.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error fetching weather data" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Add this right next to your existing app.get('/api/weather') endpoint!
app.get('/api/suggestions', async (req, res) => {
  const { query } = req.query;
  const apiKey = process.env.WEATHER_API_KEY; 
  
  try {
    const response = await fetch(`https://openweathermap.org{query}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching suggestions" });
  }
});