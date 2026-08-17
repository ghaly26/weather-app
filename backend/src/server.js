import express from 'express';
import cors from 'cors'; // 🟢 1. Add this import
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors()); // 🟢 2. Add this line to enable CORS
app.use(express.json());
const port = process.env.PORT || 5000;

// 🟢 ADDED THIS FIX: This tells Render what to show on the main page
app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "Weather App Backend Server is Running Successfully!"
  });
});

app.listen(port, () => {
  console.log(`Weather API server running on port ${port}`);
});
