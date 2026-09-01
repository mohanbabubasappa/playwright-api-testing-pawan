/*
File Upload & Download using API Chaining
API Reference:
https://fakeapi.platzi.com/en/rest/files/
*/


import { test, expect } from '@playwright/test';
import fs from 'fs';


test.describe.serial('File Upload and  Download', () => {

    let uploadedTextFile = '';

    test('Upload Text File', async ({ request }) => {

        const response = await request.post(
            'https://api.escuelajs.co/api/v1/files/upload',
            {
                multipart: {
                    file: {
                        name: 'Test2.txt',
                        mimeType: 'text/plain',
                        buffer: fs.readFileSync('./uploads/Test2.txt')
                    }
                }
            }
        );

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.originalname).toBe('Test2.txt');

        uploadedTextFile = responseBody.filename;

        console.log("Uploaded Text File:", uploadedTextFile);
    });


    test('Download Text File', async ({ request }) => {

        const response = await request.get(
            `https://api.escuelajs.co/api/v1/files/${uploadedTextFile}`
        );

        expect(response.status()).toBe(200);

        const fileContent = await response.text();

        expect(fileContent).toContain('welcome to Palywright with TypeScript');
    });

})   