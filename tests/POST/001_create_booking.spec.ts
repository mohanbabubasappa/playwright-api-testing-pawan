/*
Test: Create Booking
Request Type:  Post 
Request Body: Static

*/
import { test, expect } from "@playwright/test";

const BASE_URL = "https://restful-booker.herokuapp.com";

test("Create booking with static data", async ({ request }) => {
  //static payload
  const requestPayload = {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 1000,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-08-01",
      checkout: "2026-08-05",
    },
    additionalneeds: "Breakfast",
  };

  //send the post request

  const response = await request.post(`${BASE_URL}/booking`, {
    data: requestPayload,
  });
  const responseBody = await response.json();

  //Print the response
  console.log(responseBody);

  //validate status code/response
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");

  //Validating response body
  expect(responseBody).toHaveProperty("bookingid");
  expect(responseBody).toHaveProperty("booking");
  expect(responseBody.bookingid).toEqual(expect.any(Number));

  // Validate booking fields

  const booking = await responseBody.booking;

  expect(booking).toMatchObject({
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 1000,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-08-01",
      checkout: "2026-08-05",
    },
    additionalneeds: "Breakfast",
  });

  //expect(booking).toMatchObject(requestPayload)

  // Validate bookingdates
  expect(booking.bookingdates).toMatchObject({
    checkin: "2026-08-01",
    checkout: "2026-08-05",
  });
});
