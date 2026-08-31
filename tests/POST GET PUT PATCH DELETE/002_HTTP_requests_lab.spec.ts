/*
https://jsonplaceholder.typicode.com/guide/

 */

import { test, expect } from '@playwright/test';

// 1: GET Request
test('basic GET request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.id).toBe(1);
});

// 2: GET with Query Parameters
test('GET with query parameters', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
        params: {
            userId: 1,
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(posts.length).toBeGreaterThan(0);
});

// 3: POST Request
test('POST request', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            title: 'Test Post',
            body: 'Test Body',
            userId: 1,
        },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.title).toBe('Test Post');
});

// 4: PUT Request
test('PUT request', async ({ request }) => {
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
        data: {
            id: 1,
            title: 'Updated Title',
            body: 'Updated Body',
            userId: 1,
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.title).toBe('Updated Title');
});

//5: PATCH Request
test('PATCH request', async ({ request }) => {
    const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
        data: {
            title: 'Patched Title',
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.title).toBe('Patched Title');
});

// 6: DELETE Request
test('DELETE request', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.ok()).toBeTruthy();
});

//  7: Request with Headers
test('request with headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Accept': 'application/json',
            'X-Custom-Header': 'custom-value',
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// 8: Request with Timeout
test('request with timeout', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        timeout: 30000,
    });
    
    expect(response.ok()).toBeTruthy();
});

// 9: Response Headers
test('response headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
});

// 10: Response Body Types
test('response body types', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // JSON
    const json = await response.json();
    expect(json.id).toBe(1);
    
    // Text
    const response2 = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const text = await response2.text();
    expect(text).toContain('id');
});

