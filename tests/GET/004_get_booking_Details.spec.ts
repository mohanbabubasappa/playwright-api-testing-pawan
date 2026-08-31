import { test, expect } from "@playwright/test";

const BASE_URL = "https://restful-booker.herokuapp.com";

test("GET Booking Details by ID - Path param", async ({ request }) => {
  const bookingiD = 1;

  const response = await request.get(`${BASE_URL}/booking/${bookingiD}`); //https://restful-booker.herokuapp.com/booking/1
  const responseBody = await response.json();

  console.log(responseBody);

  //validate status code/response
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");

  // Optionally validate expected fields if known
  expect(responseBody).toHaveProperty("firstname");
  expect(responseBody).toHaveProperty("lastname");
});

test("GET Booking Details by Name - Query params", async ({ request }) => {
  //https://restful-booker.herokuapp.com/booking?firstname=Jim&lastname=Brown

  const firstname = "Jim";
  const lastname = "Brown";

  const response = await request.get(`${BASE_URL}/booking`, {
    params: {
      firstname,
      lastname,
    },
  });

  const responseBody = await response.json();
  console.log(responseBody);

  /*
            [
            { bookingid: 1062 },
            { bookingid: 1064 },
            { bookingid: 1199 },
            { bookingid: 1204 },
            { bookingid: 1320 },
            { bookingid: 1321 },
            { bookingid: 2257 },
            { bookingid: 2258 },
            { bookingid: 4959 }
            ]
        */

  //validate status code/response
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");

  //Verify booking id should be a number and should be greater than 0

  for (const item of responseBody) {
    //{ bookingid: 1062 },
    expect(item).toHaveProperty("bookingid");
    expect(typeof item.bookingid).toBe("number");
    expect(item.bookingid).toBeGreaterThan(0);
  }
});
