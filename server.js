// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your actual OpenWeatherMap API Key
const apiKey = '13727cf67ed755df9d3d91b1e608ab3b';

// Stream weather updates every 5 seconds using SSE
app.get('/tool/weather/stream', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).send({ error: 'City is required' });

    // Set headers for SSE
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.flushHeaders(); // flush the headers to establish SSE

    const sendWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            const data = {
                city: response.data.name,
                temperature: response.data.main.temp,
                condition: response.data.weather[0].description,
                time: new Date().toLocaleTimeString(),
            };

            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (err) {
            res.write(`data: ${JSON.stringify({ error: 'Failed to fetch weather data' })}\n\n`);
        }
    };

    // Send initial data
    await sendWeather();

    // Send weather updates every 5 seconds
    const intervalId = setInterval(sendWeather, 5000);

    // Handle client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

// Simple GET weather once
app.get('/tool/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).send({ error: 'City is required' });

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        res.send({
            city: response.data.name,
            temperature: response.data.main.temp,
            condition: response.data.weather[0].description
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch weather data' });
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('MCP Server is running with Weather Tool and SSE streaming!');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ MCP Server running at http://localhost:${PORT}`);
});
