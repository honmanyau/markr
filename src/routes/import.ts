import { Router } from 'express';
import xml2js from 'xml2js';
import { ResultAttributes } from '../../database/models/Result';

const router = Router();

router.post('/', async (request, response) => {
  if (request.get('Content-Type') === 'text/xml+markr') {
    const parsedData = await parseMarkrXml(request.body).catch((_error) => {
      response.status(400).send({
        ok: false,
        statusCode: 400,
        error: 'Bad request.',
        message: 'Please check that the request body is correctly formatted.',
      });
    });

    if (parsedData) {
      // TODO: handle data.
      response.status(201).send({ ok: true });
    }
  } else {
    response.status(415).send({
      ok: false,
      statusCode: 415,
      error: 'Unsupported media type.',
      message: 'Please check that the Content-Type header is correctly set.',
    });
  }
});

export default router;

// ===============
// == Functions ==
// ===============
/**
 * This function uses xml2js to parse a string that represents an XML file to
 * a JavaScript object and extracts the relevant information for further
 * processing.
 *
 * @param {string} markrXml A string that represnts an XML file.
 * @returns {object} A JavaScript object that represents a parsed XML file.
 */
function parseMarkrXml(markrXml: string): Promise<object> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(markrXml, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

/**
 * This function processes a parsed document into a format that matches the
 * requirements specified by the `Result` database model.
 *
 * @param {object} parsedData A JavaScript object produced by parsing an XML
 *     file with xml2js.
 * @returns {ResultAttributes[]} An array containing formatted results ready for
 *     database ingestion.
 */
function processReults(
  parsedData: ParsedDocument
): Promise<ResultAttributes[]> {
  return new Promise((resolve, reject) => {
    if (!parsedData.hasOwnProperty('mcq-test-results')) {
      reject(
        new Error('The document does not contain a `mcq-test-results` field ')
      );
    }
  });
}

// ===========
// == Types ==
// ===========
type ParsedDocument = {
  'mcq-test-results'?: ParsedTestResult;
};

type ParsedTestResult = {
  $?: {
    'scanned-on': string;
  };
  'first-name'?: [string];
  'last-name'?: [string];
  'student-number'?: [string];
  'test-id'?: [string];
  'summary-marks'?: SummaryMarks[];
  answer?: Answer[];
};

type SummaryMarks = {
  $?: {
    available: string;
    obtained: string;
  };
};

type Answer = {
  _?: string;
  $?: {
    question?: string;
    'marks-available'?: string;
    'marks-awarded'?: string;
  };
};
