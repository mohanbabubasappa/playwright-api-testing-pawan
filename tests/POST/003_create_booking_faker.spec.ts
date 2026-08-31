/*
Test: Create Booking
Request Type:  Post 
Request Body: Dynamic

Pre-requistes: 
----------------
Install faker-js library for generating dynamic data
  npm install @faker-js/faker

Install Luxon is a library for working with dates and times in JavaScript.
  npm install luxon

*/

import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const BASE_URL = "https://restful-booker.herokuapp.com";

test("Create booking with Faker data", async ({ request }) => {
  const firstname = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalprice = faker.number.int({ min: 100, max: 500 });
  const depositpaid = faker.datatype.boolean();
  const checkinDate = DateTime.now().toFormat("yyyy-MM-dd");
  const checkoutDate = DateTime.now().plus({ day: 5 }).toFormat("yyyy-MM-dd");
  const additionalneeds = "super bowls";

  const requestPayload = {
    firstname: firstname,
    lastname: lastName,
    totalprice: totalprice,
    depositpaid: depositpaid,
    bookingdates: {
      checkin: checkinDate,
      checkout: checkoutDate,
    },
    additionalneeds: additionalneeds,
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
    firstname: requestPayload.firstname,
    lastname: requestPayload.lastname,
    totalprice: requestPayload.totalprice,
    depositpaid: requestPayload.depositpaid,
    additionalneeds: requestPayload.additionalneeds,
  });

  // Validate bookingdates
  expect(booking.bookingdates).toMatchObject({
    checkin: requestPayload.bookingdates.checkin,
    checkout: requestPayload.bookingdates.checkout,
  });
});
