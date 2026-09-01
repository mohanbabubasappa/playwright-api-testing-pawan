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
