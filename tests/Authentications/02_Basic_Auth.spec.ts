/*
Test: Basic Authentication
Request Type: GET/POST
Description: Testing API endpoints using Basic Auth (username:password encoded in Base64)
Basic Auth Format: Authorization: Basic base64(username:password)
*/

import { test, expect } from "@playwright/test";
import Buffer from "buffer";

const BASE_URL = "https://httpbin.org";

test("Basic Auth - With valid credentials", async ({ request }) => {
  // Method 1: Using Playwright's built-in auth
  const username = "user";
  const password = "passwd";

  const response = await request.get(
    `${BASE_URL}/basic-auth/${username}/${password}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
    },
  );

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  console.log("Response:", responseBody);

  expect(responseBody).toHaveProperty("authenticated", true);
  expect(responseBody).toHaveProperty("user", username);
});

test("Basic Auth - With invalid credentials", async ({ request }) => {
  const username = "wronguser";
  const password = "wrongpassword";

  const response = await request.get(`${BASE_URL}/basic-auth/user/passwd`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
  });

  // Should return 401 Unauthorized for incorrect credentials
  expect(response.status()).toBe(401);
  console.log("Status:", response.status());
});

test("Basic Auth - Without credentials", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/basic-auth/user/passwd`);

  // Should return 401 when no Authorization header is provided
  expect(response.status()).toBe(401);
  console.log("Status without auth:", response.status());
});

test("Basic Auth - Using httpbin echo endpoint", async ({ request }) => {
  const username = "admin";
  const password = "secret123";
  const credentials = `${username}:${password}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const response = await request.post(`${BASE_URL}/post`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/json",
    },
    data: {
      message: "Testing Basic Auth",
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Request headers echoed:", responseBody.headers);

  expect(responseBody.headers).toHaveProperty("Authorization");
  expect(responseBody.headers.Authorization).toContain("Basic");
});
