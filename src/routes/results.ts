import { Router } from 'express';
import Statistics from '../database/models/Statistics';

const router = Router();

router.get('/:testId/aggregate', async (request, response) => {
  const testId = request.params.testId;
  const record = await Statistics.findOne({
    where: { testId },
  });

  if (record) {
    response.status(200).send({
      testId,
      mean: record.mean,
      count: record.count,
      p25: record.p25,
      p50: record.p50,
      p75: record.p75,
      min: record.min,
      max: record.max,
      stddev: record.stddev,
    });
  } else {
    response.status(404).send({
      ok: false,
      statusCode: 404,
      error: 'Not found.',
      message: `No record with test ID ${testId} was found.`,
    });
  }
});

export default router;
