import { Server } from 'http';
import supertest from 'supertest';
import { TEST_SERVER_PORT } from '../../markr.config';
import { app, database } from '../../src';

describe('GET /results/:testId/aggregate', () => {
  let server: Server;

  beforeAll(async () => {
    await database.init();

    server = app.listen(TEST_SERVER_PORT);
  });

  afterAll(async () => {
    await database.close();
    await server.close();
  });

  it(
    'should return a 404 if the test ID given does not exist in the database',
    (done) => {
      supertest(app)
        .get('/results/42x24/aggregate')
        .expect(404)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    });

  it(
    'should return a response with statistics and status code 200 for'
    + ' a valid test ID',
    (done) => {
      supertest(app)
      .post('/import')
      .set('Content-Type', 'text/xml+markr')
      .send(
        [
          '<mcq-test-results>',
          ' <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">',
          '   <first-name>KJ</first-name>',
          '   <last-name>Alysander</last-name>',
          '   <student-number>002299</student-number>',
          '   <test-id>9863</test-id>',
          '   <summary-marks available="20" obtained="13" />',
          ' </mcq-test-result>',
          '</mcq-test-results>',
        ].join('\n')
      )
      .expect(201)
      .end(() => {
        supertest(app)
        .get('/results/9863/aggregate')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((error, response) => {
          if (error) {
            return done(error);
          }

          // TODO: check that data matches expectation.

          return done('fail'); // TODO: remove forced failure when implemented.
        });
      });
    });
});
