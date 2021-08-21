import express from 'express';
import helmet from 'helmet';

const port = 4567;
const app = express();

// =================
// == Middlewares ==
// =================
app.use(helmet());

// ============
// == Routes ==
// ============
app.get('/', (_request, response) => {
  response.status(200).send({ ok: true });
});
app.post('/import', (request, response) => {
  if (request.get('Content-Type') === 'text/xml+markr') {
    // TODO: data parsing, validation, processing, and storage.
    
    response
      .status(200)
      .send({
        ok: true
      });
  }
  else {
    response
      .status(415)
      .send({
        ok: false,
        statusCode: 415,
        error: 'Unsupported media type.',
        message: 'Please check the Content-Type header is correctly set.'
      });
  }
});
app.get('/results/:testId/aggregate', (request, response) => {
  response
    .status(200)
    .send({
      ok: true,
      message: `Statistics for test ID ${request.params.testId}`
    });
});

// ===========
// == Start ==
// ===========
app.listen(port, () => {
  console.log(`Markr is listening at http://localhost:${port}`);
});

export default process.env.NODE_ENV === 'test' ? app : null;
