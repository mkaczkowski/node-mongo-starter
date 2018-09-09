const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const { createFakeProperty } = require('../utils/fake');

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
    it('should pass with a list of all properties', async () => {
      await request(app)
        .get('/properties')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          const propertyResult = JSON.parse(response.text);
          expect(propertyResult).toBeDefined();
          expect(propertyResult.length).toBeGreaterThan(0);

          // OR use snapshot match testing
          // expect(response.text).toMatchSnapshot();
        });
    });

    it('should pass with a list of all properties near given coordinates', async () => {
      await request(app)
        .get('/properties?longitude=1.00&latitude=1.00')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          const propertyResult = JSON.parse(response.text);
          expect(propertyResult).toBeDefined();
          expect(propertyResult.length).toBeGreaterThan(0);
        });
    });

    it('should fail with invalid search query', async () => {
      await request(app)
        .get('/properties?longitude=asd&latitude=dsa')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  describe('PATCH /properties', () => {
    const data = createFakeProperty('3512500');

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
      [data, 200], //same as above but it's here to check if it.each is working correctly
      [{ ...data, owner: undefined }, 422],
      [{ ...data, owner: null }, 422],
      [{ ...data, owner: '' }, 422],
      [{ ...data, address: { ...data.address, line1: undefined } }, 422],
      [{ ...data, address: { ...data.address, line2: undefined } }, 200],
      [{ ...data, address: { ...data.address, line3: undefined } }, 200],
      [{ ...data, address: { ...data.address, postCode: undefined } }, 422],
      [{ ...data, address: { ...data.address, city: undefined } }, 422],
      [{ ...data, address: { ...data.address, country: undefined } }, 422],
    ])('%j should respond with %i', async (data, statusCode) => {
      await request(app)
        .patch('/properties/3512500')
        .send(data)
        .expect(statusCode);
    });
  });
});
