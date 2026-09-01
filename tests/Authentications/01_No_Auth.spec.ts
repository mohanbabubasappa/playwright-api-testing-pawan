/*
Test: No Authentication
Request Type: GET
Description: Testing API endpoints that don't require authentication
*/

import { test, expect } from "@playwright/test";

const BASE_URL = "https://jsonplaceholder.typicode.com";

test("No Auth - GET public posts", async ({ request }) => {
  // Making a request to a public endpoint without any authentication
  const response = await request.get(`${BASE_URL}/posts/1`);

  // Validate status code
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  // Parse and validate response
  const post = await response.json();
  console.log("Post:", post);

  expect(post).toHaveProperty("userId");
  expect(post).toHaveProperty("id");
  expect(post).toHaveProperty("title");
  expect(post).toHaveProperty("body");
});

test("No Auth - GET list of posts", async ({ request }) => {
  const response = await request.get(`${BASE_URL}/posts`);

  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();

  const posts = await response.json();
  console.log("Total posts:", posts.length);

  expect(Array.isArray(posts)).toBeTruthy();
  expect(posts.length).toBeGreaterThan(0);
});

test("No Auth - POST without authentication", async ({ request }) => {
  const newPost = {
    title: "Test Post",
    body: "This is a test post",
    userId: 1,
  };

  const response = await request.post(`${BASE_URL}/posts`, {
    data: newPost,
  });

  expect(response.status()).toBe(201);
  const createdPost = await response.json();
  console.log("Created post:", createdPost);

  expect(createdPost).toHaveProperty("id");
});
