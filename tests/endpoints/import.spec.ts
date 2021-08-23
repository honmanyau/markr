import { Server } from 'http';
import supertest from 'supertest';
import { TEST_SERVER_PORT } from '../../src/config';
import { app, database } from '../../src';
import { createDocument } from '../utils';

describe('POST /import', () => {
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
    scannedOn: new Date('2017-12-04T12:14:11+11:00'),
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

  afterAll(async () => {
    await database.close();
    await server.close();
  });

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
    'should respond with a status code of 400 for documents with missing' +
      ' information',
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
            '   <summary-marks available="20" obtained="13" />',
            ' </mcq-test-result>',
            '</mcq-test-results>',
          ].join('\n')
        )
        .expect(400)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should respond with a status code of 201 for normally processed documents' +
      ' containing a single valid entry',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1]))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should respond with a status code of 201 for normally processed documents' +
      ' containing 2 valid entries',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2]))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should respond with a status code of 201 for normally processed documents' +
      ' containing 3 entries',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2, entry3]))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should respond with a status code of 201 for normally processed documents' +
      ' containing 4 entries, one of which is duplicated',
    (done) => {
      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry2, entry3, entry1]))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it(
    'should create a new entry for an entry with the same test ID and student' +
      ' but different first name and/or last name and return status code 201',
    (done) => {
      const entry4: typeof entry1 = {
        ...entry1,
        firstName: 'Nadeshiko',
        lastName: 'Nyanpasu',
      };

      supertest(app)
        .post('/import')
        .set('Content-Type', 'text/xml+markr')
        .send(createDocument([entry1, entry4]))
        .expect(201)
        .end((error, _res) => {
          if (error) {
            return done(error);
          }

          return done();
        });
    }
  );

  it('should reject an entry for which available > obtained', (done) => {
    const entry4: typeof entry1 = {
      ...entry1,
      obtainedMarks: entry1.availableMarks + 1,
    };

    supertest(app)
      .post('/import')
      .set('Content-Type', 'text/xml+markr')
      .send(createDocument([entry1, entry4]))
      .expect(400)
      .end((error, _res) => {
        if (error) {
          return done(error);
        }

        return done();
      });
  });
});
