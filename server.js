// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample tool: Get weather info
app.get('/tool/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).send({ error: 'City is required' });

    try {
        // Using OpenWeatherMap (sign up for a free API key)
        const apiKey = 'YOUR_OPENWEATHER_API_KEY';
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        res.send({ city: response.data.name, temperature: response.data.main.temp, condition: response.data.weather[0].description });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch weather data' });
    }
});

// MCP test endpoint
app.get('/', (req, res) => {
    res.send('MCP Server is running with Weather Tool!');
});

app.listen(PORT, () => {
    console.log(`MCP Server listening at http://localhost:${PORT}`);
});
