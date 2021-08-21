import { Router } from 'express';

const router = Router();

router.get('/:testId/aggregate', (request, response) => {
  response.status(200).send({
    ok: true,
    message: `Statistics for test ID ${request.params.testId}`,
  });
});

export default router;
