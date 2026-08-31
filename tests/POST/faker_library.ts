//Install faker-js library for generating dynamic data
// npm install @faker-js/faker

import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

console.log(faker.person.firstName());
console.log(faker.person.lastName());
console.log(faker.person.gender());
console.log(faker.person.jobTitle());

console.log(faker.internet.email());
console.log(faker.internet.password());

console.log(DateTime.now().toFormat("yyyy-MM-dd"));

/*  1 round:
Vicente
Reilly
Trigender
Lead Implementation Officer
Christopher42@gmail.com
6JoaRrUpgUs3cYB

*/

/*

Idella
Hickle
Demigender
District Accounts Designer
Christopher_Lowe@hotmail.com
Lp3BVrrVwh6KH1r

*/
