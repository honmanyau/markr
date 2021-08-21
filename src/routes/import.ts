import { Router } from 'express';
import xml2js from 'xml2js';

const router = Router();

router.post('/', (request, response) => {
  if (request.get('Content-Type') === 'text/xml+markr') {
    parseMarkrXml(request.body)
      .then((parsed) => {
        // TODO: handle data.
        response.status(201).send({ ok: true });
      })
      .catch((error) => {
        response.status(400).send({
          ok: false,
          statusCode: 400,
          error: 'Bad request.',
          message: 'Please check that the request body is correctly formatted.',
        });
      });
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
function parseMarkrXml(markrXml: string): Promise<Error | object> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(markrXml, (error, result) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}
