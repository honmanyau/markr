import { Router } from 'express';
import { Result } from '../../database/models';
import * as stats from '../lib/stats';

const router = Router();

router.get('/:testId/aggregate', async (request, response) => {
  const testId = request.params.testId;
  const results = await Result.findAll({
    where: { testId }
  });

  if (results.length > 0) {
    const percentageMarks = results
      .map((v) => v.percentageMark)
      .sort((a, b) => a - b);

    const mean = stats.mean(percentageMarks);
    const count = percentageMarks.length;
    const p25 = stats.nearestRankPercentile(percentageMarks, 0.25);
    const p50 = stats.nearestRankPercentile(percentageMarks, 0.50);
    const p75 = stats.nearestRankPercentile(percentageMarks, 0.75);
    const min = Math.min(...percentageMarks);
    const max = Math.max(...percentageMarks);
    const stddev = stats.populationStddev(percentageMarks);

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
