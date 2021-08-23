import { Router } from 'express';
import { Result } from '../database/models';
import {
  default as Statistics,
  StatisticsAttributes
} from '../database/models/Statistics';
import * as stats from '../lib/stats';

const router = Router();

router.get('/:testId/aggregate', async (request, response) => {
  const testId = request.params.testId;
  const results = await Result.findAll({
    where: { testId },
  });

  if (results.length > 0) {
    const summary = summariseResults(results);

    response.status(200).send({
      testId,
      ...summary
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

/**
 * This function create a statistics summary of an array of Result records
 * with the same test ID.
 * 
 * @param {Results[]} results An array of `Result`s.
 * @returns {StatisticsAttributes} Statistics summary of the records provided.
 */
function summariseResults(
  records: Result[]
): Omit<StatisticsAttributes, 'testId'> {
  const percentageMarks = records
    .map((v) => v.percentageMark)
    .sort((a, b) => a - b);

  const mean = stats.mean(percentageMarks);
  const count = percentageMarks.length;
  const p25 = stats.nearestRankPercentile(percentageMarks, 0.25);
  const p50 = stats.nearestRankPercentile(percentageMarks, 0.5);
  const p75 = stats.nearestRankPercentile(percentageMarks, 0.75);
  const min = Math.min(...percentageMarks);
  const max = Math.max(...percentageMarks);
  const stddev = stats.populationStddev(percentageMarks);
  
  return {
    mean: stats.mean(percentageMarks),
    count: percentageMarks.length,
    p25: stats.nearestRankPercentile(percentageMarks, 0.25),
    p50: stats.nearestRankPercentile(percentageMarks, 0.5),
    p75: stats.nearestRankPercentile(percentageMarks, 0.75),
    min: Math.min(...percentageMarks),
    max: Math.max(...percentageMarks),
    stddev: stats.populationStddev(percentageMarks),
  };
}

export default router;
