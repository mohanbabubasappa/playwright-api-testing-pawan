/*
File Upload & Download using API Chaining
API Reference:
https://fakeapi.platzi.com/en/rest/files/
*/

import { test, expect } from '@playwright/test';
import fs from 'fs';

test.describe.serial('File Upload & Download', () => {

    let uploadedPdfFile: string;

    test('Upload PDF File', async ({ request }) => {

        const response = await request.post(
            'https://api.escuelajs.co/api/v1/files/upload',
            {
                multipart: {
                    file: {
                        name: 'sample1.pdf',
                        mimeType: 'application/pdf',
                        buffer: fs.readFileSync('./uploads/sample1.pdf')
                    }
                }
            }
        );

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.originalname).toBe('sample1.pdf');

        uploadedPdfFile = responseBody.filename;

        console.log("Uploaded PDF File:", uploadedPdfFile);
    });


    //========================================================
    // Download PDF File (API Chaining)
    //========================================================

    test('Download Uploaded PDF File', async ({ request }) => {

        expect(uploadedPdfFile).toBeTruthy();

        const response = await request.get(
            `https://api.escuelajs.co/api/v1/files/${uploadedPdfFile}`
        );

        expect(response.status()).toBe(200);

        const fileContent = await response.text();

        expect(fileContent).toContain('Simple PDF');
    });


});