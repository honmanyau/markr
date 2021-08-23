import { ResultAttributes } from '../../src/database/models/Result';

/**
 * This function creates an XML document as a string given a set of parameters
 * that matches those present in the sample data.
 *
 * @param {EntryAttributes[]} entries The data to create an entries with.
 * @returns {string} A string that represents the XML structure of the
 *     `<mcq-test-result>` (note: singular) element.
 */
export function createDocument(entries: EntryAttributes[]): string {
  let xmlString = '<mcq-test-results>\n';

  for (const entry of entries) {
    xmlString += createEntry(entry) + '\n';
  }

  xmlString += '</mcq-test-results>';

  return xmlString;
}

/**
 * This function creates an XML document as a string given a set of parameters
 * that matches those present in the sample data.
 *
 * @param {EntryAttributes} entry The data to create an entry with.
 * @returns {string} A string that represents the XML structure of the
 *     `<mcq-test-result>` (note: singular) element.
 */
export function createEntry(entry: EntryAttributes): string {
  const scannedOn = new Date(entry.scannedOn).toISOString();
  const {
    firstName,
    lastName,
    studentNumber,
    testId,
    availableMarks: available,
    obtainedMarks: obtained,
  } = entry;

  return [
    `<mcq-test-result scanned-on="${scannedOn}">`,
    `<first-name>${firstName}</first-name>`,
    `<last-name>${lastName}</last-name>`,
    `<student-number>${studentNumber}</student-number>`,
    `<test-id>${testId}</test-id>`,
    `<summary-marks available="${available}" obtained="${obtained}" />`,
    `</mcq-test-result>`,
  ].join('\n');
}

// ===========
// == Types ==
// ===========
type EntryAttributes = Omit<ResultAttributes, 'percentageMark'>;
