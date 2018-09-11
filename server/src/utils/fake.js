/**
 * Create sample data with Faker (for testing purpose)
 * @param id
 * @returns Property}
 */
const faker = require('faker');

module.exports.createFakeProperty = id => ({
  _id: id,
  airbnbId: faker.random.number(10000),
  owner: faker.name.findName(),
  incomeGenerated: faker.finance.amount(),
  address: {
    line1: faker.address.streetPrefix(),
    line2: faker.address.secondaryAddress(),
    line3: faker.address.streetSuffix(),
    line4: faker.address.secondaryAddress(),
    postCode: faker.address.zipCode(),
    city: faker.address.city(),
    country: faker.address.country(),
  },
});
