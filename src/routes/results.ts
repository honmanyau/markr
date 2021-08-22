import { Router } from 'express';
import { Result } from '../../database/models';

const router = Router();

router.get('/:testId/aggregate', async (request, response) => {
  const testId = request.params.testId;
  const results = await Result.findAll({
    where: { testId }
  });

  if (results.length > 0) {
    // TODO: handle statistics.
    response.status(200).send({
      ok: true,
      message: `Statistics for test ID ${testId}`,
    });
  }
  else {
    response.status(404).send({
      ok: false,
      statusCode: 404,
      error: 'Not found.',
      message: `No record with test ID ${testId} was found.`,
    });
  }
});

export default router;
