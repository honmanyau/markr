import { Server } from 'http';
import supertest from 'supertest';
import { TEST_SERVER_PORT } from '../../markr.config';
import { app, database } from '../../src';
import * as stats from '../../src/lib/stats';
import { createDocument } from '../utils';

describe('GET /results/:testId/aggregate', () => {
  const entry1 = {
    scannedOn: new Date('2017-12-04T12:12:10+11:00'),
    firstName: 'KJ',
    lastName: 'Alysander',
    studentNumber: '002299',
    testId: '9863',
    availableMarks: 20,
    obtainedMarks: 13,
  };

  const entry2 = {
    scannedOn: new Date('2017-12-04T12:14:11+11:00'),
    firstName: 'Nyan',
    lastName: 'Pasu',
    studentNumber: '1007',
    testId: '9863',
    availableMarks: 20,
    obtainedMarks: 19,
  };

  const entry3 = {
    scannedOn: new Date('2017-12-04T12:14:14+11:00'),
    firstName: 'Alice',
    lastName: 'Bob',
    studentNumber: '4224',
    testId: '9863',
    availableMarks: 20,
    obtainedMarks: 17,
  };

  let server: Server;

  beforeAll(async () => {
    await database.init();

    server = app.listen(TEST_SERVER_PORT);
  });

  beforeEach(async () => {
    await database.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await database.close();
    await server.close();
  });

  it('should return a 404 if the test ID given does not exist in the database', (done) => {
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
    'should return a response with statistics and status code 200 for' +
      ' a valid test ID, with the correct statistics where the test ID' +
      ' only has 1 entry',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio1]);
              const expected = {
                testId: entry1.testId,
                mean: ratio1,
                count: 1,
                p25: ratio1,
                p50: ratio1,
                p75: ratio1,
                min: ratio1,
                max: ratio1,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should return a response with statistics and status code 200 for' +
      ' a valid test ID, with the correct statistics where the test ID' +
      ' only has 1 entry (different to the previous test)',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry2]))
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

              const ratio2 =
                (entry2.obtainedMarks / entry2.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio2]);
              const expected = {
                testId: entry2.testId,
                mean: ratio2,
                count: 1,
                p25: ratio2,
                p50: ratio2,
                p75: ratio2,
                min: ratio2,
                max: ratio2,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should return a response with statistics and status code 200 for' +
      ' a valid test ID, with the correct statistics where the test ID' +
      ' with has 2 entries',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const ratio2 =
                (entry2.obtainedMarks / entry2.availableMarks) * 100;
              const marks = [ratio1, ratio2];
              const mean = stats.mean(marks);
              const count = marks.length;
              const p25 = stats.nearestRankPercentile(marks, 0.25);
              const p50 = stats.nearestRankPercentile(marks, 0.5);
              const p75 = stats.nearestRankPercentile(marks, 0.75);
              const min = Math.min(...marks);
              const max = Math.max(...marks);
              const stddev = stats.populationStddev(marks);
              const expected = {
                testId: '9863',
                mean,
                count,
                p25,
                p50,
                p75,
                min,
                max,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should return a response with statistics and status code 200 for' +
      ' a valid test ID, with the correct statistics where the test ID' +
      ' with has 3 entries',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2, entry3]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const ratio2 =
                (entry2.obtainedMarks / entry2.availableMarks) * 100;
              const ratio3 =
                (entry3.obtainedMarks / entry3.availableMarks) * 100;
              const marks = [ratio1, ratio2, ratio3];
              const mean = stats.mean(marks);
              const count = marks.length;
              const p25 = stats.nearestRankPercentile(marks, 0.25);
              const p50 = stats.nearestRankPercentile(marks, 0.5);
              const p75 = stats.nearestRankPercentile(marks, 0.75);
              const min = Math.min(...marks);
              const max = Math.max(...marks);
              const stddev = stats.populationStddev(marks);
              const expected = {
                testId: '9863',
                mean,
                count,
                p25,
                p50,
                p75,
                min,
                max,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should return a response with statistics and status code 200 for' +
      ' a valid test ID, with the correct statistics for where the test ID' +
      ' with has 3 entries. Entries in the database with different test IDs' +
      ' should not interfere with the statistics',
    (done) => {
      const entry4 = {
        ...entry1,
        testId: entry1.testId + 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2, entry3, entry4]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const ratio2 =
                (entry2.obtainedMarks / entry2.availableMarks) * 100;
              const ratio3 =
                (entry3.obtainedMarks / entry3.availableMarks) * 100;
              const marks = [ratio1, ratio2, ratio3];
              const mean = stats.mean(marks);
              const count = marks.length;
              const p25 = stats.nearestRankPercentile(marks, 0.25);
              const p50 = stats.nearestRankPercentile(marks, 0.5);
              const p75 = stats.nearestRankPercentile(marks, 0.75);
              const min = Math.min(...marks);
              const max = Math.max(...marks);
              const stddev = stats.populationStddev(marks);
              const expected = {
                testId: '9863',
                mean,
                count,
                p25,
                p50,
                p75,
                min,
                max,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should give updated statistics when presented with a new record with the' +
      ' same test ID, student number, first name and last name; and has a' +
      ' higher available mark. This cases tests for both higher available and' +
      ' obtained marks',
    (done) => {
      const entry4 = {
        ...entry1,
        availableMarks: entry1.availableMarks + 1,
        obtainedMarks: entry1.obtainedMarks + 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio4 =
                (entry4.obtainedMarks / entry4.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio4]);
              const expected = {
                testId: entry4.testId,
                mean: ratio4,
                count: 1,
                p25: ratio4,
                p50: ratio4,
                p75: ratio4,
                min: ratio4,
                max: ratio4,
                stddev,
              };

              expect(entry4.availableMarks > entry1.availableMarks);
              expect(entry4.obtainedMarks > entry1.obtainedMarks);
              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should give updated statistics when presented with a new record with the' +
      ' same test ID, student number, first name and last name; and has a' +
      ' higher available mark. This cases tests for a higher available mark and' +
      ' a equal obtained mark',
    (done) => {
      const entry4 = {
        ...entry1,
        availableMarks: entry1.availableMarks + 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio4 =
                (entry4.obtainedMarks / entry4.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio4]);
              const expected = {
                testId: entry1.testId,
                mean: ratio4,
                count: 1,
                p25: ratio4,
                p50: ratio4,
                p75: ratio4,
                min: ratio4,
                max: ratio4,
                stddev,
              };

              expect(entry4.availableMarks > entry1.availableMarks);
              expect(entry4.obtainedMarks === entry1.obtainedMarks);
              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should give updated statistics when presented with a new record with the' +
      ' same test ID, student number, first name and last name; and has a' +
      ' higher available mark. This cases tests for a higher available mark and' +
      ' a lower obtained mark',
    (done) => {
      const entry4 = {
        ...entry1,
        available: entry1.availableMarks + 1,
        obtained: entry1.obtainedMarks - 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio4 =
                (entry4.obtainedMarks / entry4.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio4]);
              const expected = {
                testId: entry1.testId,
                mean: ratio4,
                count: 1,
                p25: ratio4,
                p50: ratio4,
                p75: ratio4,
                min: ratio4,
                max: ratio4,
                stddev,
              };

              expect(entry4.availableMarks > entry1.availableMarks);
              expect(entry4.obtainedMarks < entry1.obtainedMarks);
              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should give updated statistics when presented with a new record ' +
      ' with the same test ID, student number, first name and last name; and' +
      ' has a higher obtained mark and a equal available mark.',
    (done) => {
      const entry4 = {
        ...entry1,
        obtainedMarks: entry1.obtainedMarks + 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio4 =
                (entry4.obtainedMarks / entry4.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio4]);
              const expected = {
                testId: entry1.testId,
                mean: ratio4,
                count: 1,
                p25: ratio4,
                p50: ratio4,
                p75: ratio4,
                min: ratio4,
                max: ratio4,
                stddev,
              };

              expect(entry4.obtainedMarks > entry1.obtainedMarks);
              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'should retain previous statistics when presented with a new record' +
      ' with the same test ID, student number, first name and last name; and' +
      ' has a higher obtained mark and a equal available mark.',
    (done) => {
      const entry4 = {
        ...entry1,
        obtainedMarks: entry1.obtainedMarks - 1,
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const stddev = stats.populationStddev([ratio1]);
              const expected = {
                testId: entry1.testId,
                mean: ratio1,
                count: 1,
                p25: ratio1,
                p50: ratio1,
                p75: ratio1,
                min: ratio1,
                max: ratio1,
                stddev,
              };

              expect(entry4.obtainedMarks < entry1.obtainedMarks);
              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );

  it(
    'An entry with the same test ID and student number but different first name' +
      ' and/or last name should lead to the creation of a new record',
    (done) => {
      const entry4 = {
        ...entry1,
        firstName: 'Nadeshiko',
        lastName: 'Nyanpasu',
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
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

              const ratio1 =
                (entry1.obtainedMarks / entry1.availableMarks) * 100;
              const ratio4 =
                (entry4.obtainedMarks / entry4.availableMarks) * 100;
              const marks = [ratio1, ratio4];
              const mean = stats.mean(marks);
              const count = marks.length;
              const p25 = stats.nearestRankPercentile(marks, 0.25);
              const p50 = stats.nearestRankPercentile(marks, 0.5);
              const p75 = stats.nearestRankPercentile(marks, 0.75);
              const min = Math.min(...marks);
              const max = Math.max(...marks);
              const stddev = stats.populationStddev(marks);
              const expected = {
                testId: entry1.testId,
                mean,
                count,
                p25,
                p50,
                p75,
                min,
                max,
                stddev,
              };

              expect(expected).toEqual(response.body);

              return done();
            });
        });
    }
  );
});
