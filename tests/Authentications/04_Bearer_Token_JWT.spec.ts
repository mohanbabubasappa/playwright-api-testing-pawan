/*
Test: Bearer Token Authentication (JWT - JSON Web Token)
Request Type: GET/POST
Description: Testing API endpoints using Bearer Token (JWT) authentication
Bearer Token Format: Authorization: Bearer <jwt-token>

JWT Token Structure: header.payload.signature
- Header: Algorithm and token type
- Payload: User data and claims
- Signature: Verification signature
*/

import { test, expect } from "@playwright/test";

const BASE_URL = "https://httpbin.org";

test("Bearer Token - With valid token", async ({ request }) => {
  // Example JWT token (this is a real-looking but fake token)
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  const response = await request.get(`${BASE_URL}/bearer`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Response:", responseBody);

  expect(responseBody).toHaveProperty("authenticated", true);
});

test("Bearer Token - Without token (Unauthorized)", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/bearer`);

  // Should return 401 Unauthorized without token
  expect(response.status()).toBe(401);
  console.log("Status without token:", response.status());
});

test("Bearer Token - With invalid/expired token", async ({ request }) => {
  const invalidToken = "invalid.token.here";

  const response = await request.get(`${BASE_URL}/bearer`, {
    headers: {
      Authorization: `Bearer ${invalidToken}`,
    },
  });

  // Typically returns 401 for invalid token
  expect(response.status()).toBe(401);
  console.log("Status with invalid token:", response.status());
});

test("Bearer Token - POST request with JWT", async ({ request }) => {
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwibmFtZSI6IkFsaWNlIn0.signature";

  const response = await request.post(`${BASE_URL}/post`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    data: {
      title: "New Post",
      content: "This is a protected resource",
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Headers received:", responseBody.headers);

  expect(responseBody.headers).toHaveProperty("Authorization");
  expect(responseBody.headers.Authorization).toContain("Bearer");
});

test("Bearer Token - GET protected resource", async ({ request }) => {
  // Simulating a token that might be received after login
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQm9iIiwicm9sZSI6InVzZXIifQ.token";

  const response = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Authorization header:", responseBody.headers.Authorization);

  expect(responseBody.headers.Authorization).toBe(`Bearer ${accessToken}`);
});

test("Bearer Token - Refresh token flow (simulate)", async ({ request }) => {
  // Step 1: Initial request with valid token
  const currentToken = "valid.jwt.token";

  const response1 = await request.post(`${BASE_URL}/post`, {
    headers: {
      Authorization: `Bearer ${currentToken}`,
    },
    data: {
      action: "get_data",
    },
  });

  expect(response1.status()).toBe(200);
  console.log("Step 1 - Initial request successful");

  // Step 2: Simulate token refresh
  const newToken = "renewed.jwt.token.new";

  const response2 = await request.post(`${BASE_URL}/post`, {
    headers: {
      Authorization: `Bearer ${newToken}`,
    },
    data: {
      action: "refresh_token",
    },
  });

  expect(response2.status()).toBe(200);
  console.log("Step 2 - Token refreshed");

  // Step 3: Use new token for subsequent requests
  const response3 = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${newToken}`,
    },
  });

  expect(response3.status()).toBe(200);
  console.log("Step 3 - Subsequent request with new token successful");
});

test("Bearer Token - Case sensitivity check", async ({ request }) => {
  const token = "test.jwt.token";

  // Correct format
  const response1 = await request.get(`${BASE_URL}/bearer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Correct format (Bearer):", response1.status());

  // Lowercase might not work depending on API
  const response2 = await request.get(`${BASE_URL}/bearer`, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  console.log("Lowercase format (bearer):", response2.status());
});

test("Bearer Token - Decode JWT payload (example)", async ({ request }) => {
  // Example JWT with readable payload
  // Header: {"alg":"HS256","typ":"JWT"}
  // Payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // Decode payload (in real scenario, you might validate signature)
  const parts = jwtToken.split(".");
  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));

  console.log("JWT Payload:", payload);
  expect(payload).toHaveProperty("name", "John Doe");
  expect(payload).toHaveProperty("sub", "1234567890");

  // Use token in request
  const response = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  expect(response.status()).toBe(200);
});
