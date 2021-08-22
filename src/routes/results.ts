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
    const mean = -1;
    const count = -1;
    const p25 = -1;
    const p50 = -1;
    const p75 = -1;
    const min = -1;
    const max = -1;
    const stddev = -1;

    response.status(200).send({
      testId,
      mean,
      count,
      p25,
      p50,
      p75,
      min,
      max,
      stddev,
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
