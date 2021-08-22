import fs from 'fs';
import { Router } from 'express';
import path from 'path';
import xml2js from 'xml2js';
import {
  default as Result,
  ResultAttributes,
} from '../database/models/Result';

const router = Router();

router.post('/', async (request, response) => {
  if (request.get('Content-Type') === 'text/xml+markr') {
    let documentRejected = false;

    const parsedXml = await parseMarkrXml(request.body).catch(() => {
      documentRejected = true;
    });

    if (parsedXml) {
      const processedEntries = await processReults(parsedXml).catch(() => {
        documentRejected = true;
      });

      if (processedEntries) {
        for (const processedEntry of processedEntries) {
          const {
            testId,
            studentNumber,
            firstName,
            lastName
          } = processedEntry;

          const record = await Result.findOne({
            where: {
              testId,
              studentNumber,
              firstName,
              lastName,
            },
          });

          if (record) {
            let shouldUpdate = false;
            
            if (processedEntry.availableMarks > record.availableMarks) {
              shouldUpdate = true;
            } else if (
              processedEntry.availableMarks === record.availableMarks &&
              processedEntry.obtainedMarks > record.obtainedMarks
            ) {
              shouldUpdate = true;
            }

            if (shouldUpdate) {
              const { availableMarks, obtainedMarks } = processedEntry;
              const percentageMark = obtainedMarks / availableMarks * 100;

              await record.update({
                availableMarks,
                obtainedMarks,
                percentageMark,
              });
            }
          } else {
            await Result.create(processedEntry);
          }
        }
      }
    }

    if (process.env.NODE_ENV !== 'test' && documentRejected) {
      const hash = Math.random().toString(36).slice(2, 8);
      const filename = `${Date.now()}_${hash}.txt`;
      const fileDir = path.join(
        process.cwd(),
        'rejected',
        process.env.NODE_ENV === 'development' ? 'dev' : ''
      );
      const filePath = path.join(fileDir, filename);

      await fs.promises.readdir(fileDir).catch((_error) => {
        return fs.promises.mkdir(fileDir);
      });

      await fs.promises.writeFile(filePath, request.body);
      
      response.status(400).send({
        ok: false,
        statusCode: 400,
        error: 'Bad request.',
        message: 'The document is malformed, has invalid or missing fields.',
      });
    }
    else {
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
    if (!parsedData['mcq-test-results']) {
      reject(
        new Error('The document does not contain a `mcq-test-results` field.')
      );
    } else if (!parsedData['mcq-test-results']['mcq-test-result']) {
      reject(new Error('The document does not contain any test results.'));
    } else {
      const formattedResults: ResultAttributes[] = [];
      const testResults = parsedData['mcq-test-results']['mcq-test-result'];
      for (const testResult of testResults) {
        // TODO: refactor these type guards.
        if (
          !testResult ||
          !testResult.$ ||
          !testResult.$['scanned-on'] ||
          !(new Date(testResult.$['scanned-on'])) ||
          !testResult['first-name'] ||
          testResult['first-name'].length !== 1 ||
          !testResult['last-name'] ||
          testResult['last-name'].length !== 1 ||
          !testResult['student-number'] ||
          testResult['student-number'].length !== 1 ||
          !testResult['test-id'] ||
          testResult['test-id'].length !== 1 ||
          !testResult['summary-marks'] ||
          testResult['summary-marks'].length !== 1 ||
          !testResult['summary-marks'][0] ||
          !testResult['summary-marks'][0].$ ||
          !testResult['summary-marks'][0].$.available ||
          !testResult['summary-marks'][0].$.available.length ||
          !testResult['summary-marks'][0].$.obtained ||
          !testResult['summary-marks'][0].$.obtained.length ||
          (Number(testResult['summary-marks'][0].$.obtained) > 
              Number(testResult['summary-marks'][0].$.available))
        ) {
          reject(
            new Error('The document contains an entry with missing fields.')
          );

          break;
        } else {
          const scannedOn = new Date(testResult.$['scanned-on']);
          const firstName = testResult['first-name'][0];
          const lastName = testResult['last-name'][0];
          const studentNumber = testResult['student-number'][0];
          const testId = testResult['test-id'][0];
          const availableMarks = Number(
            testResult['summary-marks'][0].$.available
          );
          const obtainedMarks = Number(
            testResult['summary-marks'][0].$.obtained
          );
          const percentageMark = (obtainedMarks / availableMarks) * 100;

          formattedResults.push({
            scannedOn,
            firstName,
            lastName,
            studentNumber,
            testId,
            availableMarks,
            obtainedMarks,
            percentageMark,
          });
        }
      }

      resolve(formattedResults);
    }
  });
}

// ===========
// == Types ==
// ===========
type ParsedDocument = {
  'mcq-test-results'?: {
    'mcq-test-result': ParsedTestResult[];
  };
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
