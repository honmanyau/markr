import { Router } from 'express';

const router = Router();

router.post('/', (request, response) => {
  if (request.get('Content-Type') === 'text/xml+markr') {
    // TODO: data parsing, validation, processing, and storage.

    response.status(200).send({ ok: true });
  } else {
    response.status(415).send({
      ok: false,
      statusCode: 415,
      error: 'Unsupported media type.',
      message: 'Please check the Content-Type header is correctly set.',
    });
  }
});

export default router;
