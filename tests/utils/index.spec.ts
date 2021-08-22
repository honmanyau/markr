import { createDocument, createEntry } from '.';

describe('/test/utils/index.ts', () => {
  describe('createDocument()', () => {
    it(
      'should create a document that matches the sample input for a single.'
      + ' entry',
      () => {
        const datetimeString = '2017-12-04T12:12:10+11:00';
        const isoDatetimeString = new Date(datetimeString)
          .toISOString();
        const expected = [
          '<mcq-test-results>',
          `<mcq-test-result scanned-on="${isoDatetimeString}">`,
          '<first-name>KJ</first-name>',
          '<last-name>Alysander</last-name>',
          '<student-number>002299</student-number>',
          '<test-id>9863</test-id>',
          '<summary-marks available="20" obtained="13" />',
          '</mcq-test-result>',
          '</mcq-test-results>',
        ].join('\n');
        const result = createDocument([
          {
            scannedOn: new Date(datetimeString),
            firstName: 'KJ',
            lastName: 'Alysander',
            studentNumber: '002299',
            testId: '9863',
            availableMarks: 20,
            obtainedMarks: 13,
          }
        ]);

        expect(result).toEqual(expected);
      }
    );

    it(
      'should create a document that matches the sample input for a 2 entries.',
      () => {
        const datetimeString = '2017-12-04T12:12:10+11:00';
        const datetimeString2 = '2017-12-04T12:14:11+11:00';
        const isoDatetimeString = new Date(datetimeString)
          .toISOString();
        const isoDatetimeString2 = new Date(datetimeString2)
        .toISOString();
        const expected = [
          '<mcq-test-results>',
          `<mcq-test-result scanned-on="${isoDatetimeString}">`,
          '<first-name>KJ</first-name>',
          '<last-name>Alysander</last-name>',
          '<student-number>002299</student-number>',
          '<test-id>9863</test-id>',
          '<summary-marks available="20" obtained="13" />',
          '</mcq-test-result>',
          `<mcq-test-result scanned-on="${isoDatetimeString2}">`,
          '<first-name>Nyan</first-name>',
          '<last-name>Pasu</last-name>',
          '<student-number>4224</student-number>',
          '<test-id>9863</test-id>',
          '<summary-marks available="20" obtained="19" />',
          '</mcq-test-result>',
          '</mcq-test-results>',
        ].join('\n');
        const result = createDocument([
          {
            scannedOn: new Date(datetimeString),
            firstName: 'KJ',
            lastName: 'Alysander',
            studentNumber: '002299',
            testId: '9863',
            availableMarks: 20,
            obtainedMarks: 13,
          },
          {
            scannedOn: new Date(datetimeString2),
            firstName: 'Nyan',
            lastName: 'Pasu',
            studentNumber: '4224',
            testId: '9863',
            availableMarks: 20,
            obtainedMarks: 19,
          }
        ]);

        expect(result).toEqual(expected);
      }
    );
  });

  describe('createEntry()', () => {
    it(
      'should create an entry that matches the sample input.',
      () => {
        const datetimeString = '2017-12-04T12:12:10+11:00';
        const isoDatetimeString = new Date(datetimeString)
          .toISOString();
        const expected = [
          `<mcq-test-result scanned-on="${isoDatetimeString}">`,
          '<first-name>KJ</first-name>',
          '<last-name>Alysander</last-name>',
          '<student-number>002299</student-number>',
          '<test-id>9863</test-id>',
          '<summary-marks available="20" obtained="13" />',
          '</mcq-test-result>',
        ].join('\n');
        const result = createEntry({
          scannedOn: new Date(datetimeString),
          firstName: 'KJ',
          lastName: 'Alysander',
          studentNumber: '002299',
          testId: '9863',
          availableMarks: 20,
          obtainedMarks: 13,
        });

        expect(result).toEqual(expected);
      }
    );
  });
});