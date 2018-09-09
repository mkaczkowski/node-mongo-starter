const mongoose = require('mongoose');
const request = require('supertest');
const faker = require('faker');
const app = require('../app');

//TODO create a mongodb-memory-server and setup / tearDown fresh DB
describe('Integration API testing', () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.DATABASE,
      { useNewUrlParser: true }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /properties', () => {
    it('should respond with json containing a list of all properties', async () => {
      await request(app)
        .get('/properties')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          expect(JSON.parse(response.text)).toBeDefined();
          expect(JSON.parse(response.text).length).toBeGreaterThan(0);

          // OR use snapshot match testing
          // expect(response.text).toMatchSnapshot();
        });
    });
  });

  describe('PATCH /properties', () => {
    //create sample data with Faker
    const data = {
      airbnbId: '3512500',
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
    };

    it('should respond with 200 OK', async () => {
      await request(app)
        .patch('/properties/3512500')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          const propertyResult = JSON.parse(response.text);
          expect(propertyResult).toBeDefined();
          expect(propertyResult._id).toBeUndefined();
          expect(propertyResult.numberOfBedrooms).toBeUndefined();
          expect(propertyResult.numberOfBathrooms).toBeUndefined();
          expect(propertyResult.location).toBeUndefined();
          expect(propertyResult.airbnbId).toEqual(3512500);
          expect(propertyResult.incomeGenerated).toBeDefined();
          expect(propertyResult.address).toBeDefined();
          expect(propertyResult.address.line1).toBeDefined();
          expect(propertyResult.address.line2).toBeDefined();
          expect(propertyResult.address.line3).toBeDefined();
          expect(propertyResult.address.line4).toBeDefined();
          expect(propertyResult.address.postCode).toBeDefined();
          expect(propertyResult.address.city).toBeDefined();
          expect(propertyResult.address.country).toBeDefined();

          // OR use SNAPSHOT match testing
          // expect( response.text).toMatchSnapshot();
        });
    });

    it.each([
      [data, 200],
      [{ ...data, owner: undefined }, 422],
      [{ ...data, owner: null }, 422],
      [{ ...data, owner: '' }, 422],
      [{ ...data, address:{...data.address, line1:undefined} }, 422],
      [{ ...data, address:{...data.address, line2:undefined} }, 200],
      [{ ...data, address:{...data.address, line3:undefined} }, 200],
      [{ ...data, address:{...data.address, postCode:undefined} }, 422],
      [{ ...data, address:{...data.address, city:undefined} }, 422],
      [{ ...data, address:{...data.address, country:undefined} }, 422],
    ])('%j should respond with %i', async (data, statusCode) => {
      await request(app)
        .patch('/properties/3512500')
        .send(data)
        .expect(statusCode);
    });
  });
});
