/*
Test: OAuth 2.0 Authentication
Request Type: GET/POST
Description: Testing API endpoints using OAuth 2.0 authentication

OAuth 2.0 Flow Types:
1. Authorization Code Flow - for web applications
2. Implicit Flow - for browser-based applications (deprecated)
3. Client Credentials Flow - for server-to-server
4. Resource Owner Password Flow - for trusted applications
5. Refresh Token Flow - to get new access tokens

This test demonstrates common OAuth 2.0 scenarios
*/

import { test, expect } from "@playwright/test";

const BASE_URL = "https://httpbin.org";

// Example OAuth 2.0 Configuration
const oauth2Config = {
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  redirectUri: "https://yourapp.com/callback",
  authorizationUrl: "https://oauth-provider.com/authorize",
  tokenUrl: "https://oauth-provider.com/token",
  scope: "read write",
};

test("OAuth 2.0 - Authorization Code Flow (Step 1: Get Authorization Code)", async ({
  request,
}) => {
  // Step 1: Redirect user to authorization server
  // In real scenario, user would log in and authorize
  // This would return an authorization code

  console.log("Authorization URL:", oauth2Config.authorizationUrl);
  console.log("Client ID:", oauth2Config.clientId);
  console.log("Redirect URI:", oauth2Config.redirectUri);
  console.log("Scope:", oauth2Config.scope);

  // In automated tests, you typically skip this step and use mock tokens
  expect(oauth2Config.clientId).toBeDefined();
  expect(oauth2Config.redirectUri).toBeDefined();
});

test("OAuth 2.0 - Authorization Code Flow (Step 2: Exchange Code for Token)", async ({
  request,
}) => {
  // Step 2: Exchange authorization code for access token
  // Simulating the token exchange
  const authorizationCode = "mock-auth-code-12345";

  const response = await request.post(`${BASE_URL}/post`, {
    data: {
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: oauth2Config.redirectUri,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
    },
  });

  expect(response.status()).toBe(200);
  const tokenResponse = await response.json();
  console.log("Token Response:", tokenResponse);
});

test("OAuth 2.0 - Client Credentials Flow", async ({ request }) => {
  // Client Credentials Flow - for server-to-server communication
  // No user interaction needed

  const response = await request.post(`${BASE_URL}/post`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "client_credentials",
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
      scope: oauth2Config.scope,
    },
  });

  expect(response.status()).toBe(200);
  const tokenResponse = await response.json();
  console.log("Client Credentials Token Response:", tokenResponse);

  // In real response, you'd get:
  // {
  //   "access_token": "token-value",
  //   "token_type": "Bearer",
  //   "expires_in": 3600,
  //   "scope": "read write"
  // }
});

test("OAuth 2.0 - Using Access Token", async ({ request }) => {
  // After obtaining access token, use it to access protected resources
  const accessToken = "mock-access-token-abc123";

  const response = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log("Protected resource accessed:", responseBody);

  expect(responseBody.headers.Authorization).toContain("Bearer");
});

test("OAuth 2.0 - Refresh Token Flow", async ({ request }) => {
  // Refresh Token Flow - to get new access token when expired
  const refreshToken = "mock-refresh-token-xyz789";

  const response = await request.post(`${BASE_URL}/post`, {
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
    },
  });

  expect(response.status()).toBe(200);
  const newTokenResponse = await response.json();
  console.log("New Token Response:", newTokenResponse);
});

test("OAuth 2.0 - Resource Owner Password Flow", async ({ request }) => {
  // Resource Owner Password Flow - for trusted applications
  // User credentials passed directly (less secure, use with caution)

  const response = await request.post(`${BASE_URL}/post`, {
    data: {
      grant_type: "password",
      username: "user@example.com",
      password: "user-password",
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
      scope: oauth2Config.scope,
    },
  });

  expect(response.status()).toBe(200);
  const tokenResponse = await response.json();
  console.log("Password Grant Token Response:", tokenResponse);
});

test("OAuth 2.0 - Token Revocation", async ({ request }) => {
  // Revoke token (logout/sign out)
  const accessToken = "mock-access-token-to-revoke";

  const response = await request.post(`${BASE_URL}/post`, {
    data: {
      token: accessToken,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
    },
  });

  console.log("Token revocation response status:", response.status());
  expect([200, 204]).toContain(response.status());
});

test("OAuth 2.0 - Invalid Token Handling", async ({ request }) => {
  // Attempt to use expired/invalid token
  const expiredToken = "expired-token-123";

  const response = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${expiredToken}`,
    },
  });

  // Note: httpbin will accept any token, but real OAuth server would reject
  console.log("Response status:", response.status());
  // Real OAuth server would return 401: Unauthorized
});

test("OAuth 2.0 - Missing Token", async ({ request }) => {
  // Request without token to protected resource
  const response = await request.get(`${BASE_URL}/get`);

  // Should still work with httpbin, but real OAuth server would return 401
  expect(response.status()).toBe(200);
  console.log("Response without token:", response.status());
});

test("OAuth 2.0 - Scope Verification", async ({ request }) => {
  // Verify that token has required scopes
  const accessToken = "mock-token-with-scopes";
  const requiredScopes = ["read", "write"];

  // In real scenario, decode JWT to check scopes
  const tokenParts = accessToken.split(".");
  console.log("Token parts:", tokenParts.length);

  // Make request with scoped token
  const response = await request.post(`${BASE_URL}/post`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      resource: "protected_data",
      requiredScopes: requiredScopes,
    },
  });

  expect(response.status()).toBe(200);
  console.log("Scoped request successful");
});

test("OAuth 2.0 - Complete Authorization Code Flow", async ({ request }) => {
  // Simulating complete OAuth 2.0 Authorization Code Flow

  console.log("=== OAuth 2.0 Authorization Code Flow ===");

  // Step 1: Authorization Request (simulated)
  console.log("Step 1: User is redirected to authorization server");
  console.log(
    `URL: ${oauth2Config.authorizationUrl}?client_id=${oauth2Config.clientId}&redirect_uri=${oauth2Config.redirectUri}&scope=${oauth2Config.scope}&response_type=code`,
  );

  // Step 2: User authorizes (simulated)
  console.log("Step 2: User logs in and authorizes the application");
  const authorizationCode = "auth-code-received-from-server";

  // Step 3: Token Exchange
  console.log("Step 3: Exchange authorization code for access token");
  const tokenResponse = await request.post(`${BASE_URL}/post`, {
    data: {
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: oauth2Config.redirectUri,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
    },
  });

  expect(tokenResponse.status()).toBe(200);
  const tokens = await tokenResponse.json();
  console.log("Tokens received (mock):", {
    access_token: "****",
    token_type: "Bearer",
    expires_in: 3600,
  });

  // Step 4: Access Protected Resource
  console.log("Step 4: Use access token to access protected resources");
  const accessToken = "mock-access-token";
  const apiResponse = await request.get(`${BASE_URL}/get`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  expect(apiResponse.status()).toBe(200);
  console.log("Protected resource accessed successfully");

  // Step 5: Refresh Token (when access token expires)
  console.log("Step 5: Refresh access token");
  const refreshToken = "mock-refresh-token";
  const refreshResponse = await request.post(`${BASE_URL}/post`, {
    data: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: oauth2Config.clientId,
      client_secret: oauth2Config.clientSecret,
    },
  });

  expect(refreshResponse.status()).toBe(200);
  console.log("Access token refreshed successfully");

  console.log("=== OAuth 2.0 Flow Completed ===");
});
