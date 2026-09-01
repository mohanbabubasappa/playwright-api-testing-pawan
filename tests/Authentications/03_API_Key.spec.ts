/*
Test: API Key Authentication
Request Type: GET/POST
Description: Testing API endpoints using API Key authentication
API Key can be passed via:
- Header: X-API-Key, API-Key, Authorization: ApiKey xxx
- Query Parameter: ?api_key=xxx
*/

import { test, expect } from "@playwright/test";

// Note: These are example APIs - replace with your actual API endpoint
// Using OpenWeatherMap API as an example (requires real API key)

test("API Key - In Header (X-API-Key)", async ({ request }) => {
  const apiKey = "your-api-key-here";

  // Example: Custom API with X-API-Key header
  const response = await request.get("https://httpbin.org/bearer", {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  console.log("Response status:", response.status());
  const responseBody = await response.json();
  console.log("Response:", responseBody);
});

test("API Key - In Query Parameter", async ({ request }) => {
  const apiKey = "test-api-key-12345";

  // Example: API with API key as query parameter
  const response = await request.get(
    `https://httpbin.org/get?api_key=${apiKey}`,
  );

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Query params received:", responseBody.args);

  expect(responseBody.args).toHaveProperty("api_key", apiKey);
});

test("API Key - In Authorization Header", async ({ request }) => {
  const apiKey = "sk_test_1234567890abcdef";

  // Example: API using Authorization header with ApiKey scheme
  const response = await request.get("https://httpbin.org/bearer", {
    headers: {
      Authorization: `ApiKey ${apiKey}`,
    },
  });

  console.log("Response status:", response.status());
  const responseBody = await response.json();
  console.log("Response:", responseBody);
});

test("API Key - Missing API Key (Unauthorized)", async ({ request }) => {
  // Making request without API key should fail
  const response = await request.get("https://httpbin.org/bearer");

  // Typically returns 401 Unauthorized or 403 Forbidden
  expect([401, 403]).toContain(response.status());
  console.log("Status without API key:", response.status());
});

test("API Key - Invalid API Key", async ({ request }) => {
  const invalidApiKey = "invalid-key-xyz";

  const response = await request.get("https://httpbin.org/bearer", {
    headers: {
      "X-API-Key": invalidApiKey,
    },
  });

  // Should return 401 or 403 for invalid key
  expect([401, 403]).toContain(response.status());
  console.log("Status with invalid key:", response.status());
});

test("API Key - POST request with API Key", async ({ request }) => {
  const apiKey = "secure-api-key-xyz";

  const response = await request.post("https://httpbin.org/post", {
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Headers sent:", responseBody.headers);

  expect(responseBody.headers).toHaveProperty("X-api-key", apiKey);
});

// Real-world example with OpenWeatherMap (requires actual API key)
test("API Key - Real API Example (OpenWeatherMap)", async ({ request }) => {
  // Replace with your actual OpenWeatherMap API key
  const apiKey = "YOUR_ACTUAL_API_KEY";
  const city = "London";

  const response = await request.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: city,
        appid: apiKey,
      },
    },
  );

  // Skip this test if using placeholder API key
  if (apiKey === "YOUR_ACTUAL_API_KEY") {
    console.log("Skipping real API test - provide actual API key");
    return;
  }

  expect(response.status()).toBe(200);
  const weatherData = await response.json();
  console.log("Weather data:", weatherData);

  expect(weatherData).toHaveProperty("name", city);
  expect(weatherData).toHaveProperty("weather");
});
