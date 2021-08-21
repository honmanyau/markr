import supertest from 'supertest';
import app from '../../src';

describe('POST /import', () => {
  it(
    'should reject requests with incorrect Content-Type with status code 415', 
    (done) => {
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
    }
  );
});