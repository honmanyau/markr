import supertest from 'supertest';
import app from '../../src';

describe('POST /import', () => {
  it('should reject requests with incorrect Content-Type with status code 415', (done) => {
    supertest(app)
      .post('/import')
      .set('Content-Type', 'text')
      .expect(415)
      .end((error, _res) => {
        if (error) {
          return done(error);
        }

        return done();
      });
  });

  it('should reject malformed request body with status code 400', (done) => {
    supertest(app)
      .post('/import')
      .set('Content-Type', 'text/xml+markr')
      .send('<mcq-test-results></malformed>')
      .expect(400)
      .end((error, _res) => {
        if (error) {
          return done(error);
        }

        return done();
      });
  });

  it(
    'should respond with a status code of 202 for documents with missing' +
      ' information',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send([
          '<mcq-test-results>',
          ' <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">',
          '   <first-name>KJ</first-name>',
          '   <last-name>Alysander</last-name>',
          '   <student-number>002299</student-number>',
          '   <summary-marks available="20" obtained="13" />',
          ' </mcq-test-result>',
          '</mcq-test-results>',
        ].join('\n'))
        .expect(202)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should respond with a status code of 201 for normally processed documents',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send([
          '<mcq-test-results>',
          ' <mcq-test-result scanned-on="2017-12-04T12:12:10+11:00">',
          '   <first-name>KJ</first-name>',
          '   <last-name>Alysander</last-name>',
          '   <student-number>002299</student-number>',
          '   <test-id>9863</test-id>',
          '   <summary-marks available="20" obtained="13" />',
          ' </mcq-test-result>',
          '</mcq-test-results>',
        ].join('\n'))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );
});
