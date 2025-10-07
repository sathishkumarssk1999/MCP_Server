// server.mjs
import { FastMCP } from "fastmcp";
import { z } from "zod";
import axios from "axios";

// Create the MCP server
const server = new FastMCP({
  name: "WeatherMCP",
  version: "1.0.0",
});

// Add tool: get weather
server.addTool({
  name: "get_weather",
  description: "Get weather by city name",
  parameters: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    const apiKey = "13727cf67ed755df9d3d91b1e608ab3b";


    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        appid: apiKey,
        units: "metric",
      },
    });

    const data = response.data;

    return {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
    };
  },
});

// Start MCP server with streamable HTTP
server.start({
  transportType: "httpStream",
  httpStream: {
    port: process.env.PORT || 10000,
    path: "/mcp",
    stateless: false,
  },
});

console.log("✅ MCP server is running at http://localhost:8080/mcp");
