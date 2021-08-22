import {
  mean,
  nearestRankPercentile,
  populationVariance,
  populationStddev,
  sum,
} from '../../../src/lib/stats';

describe('src/lib/stats', () => {
  describe('mean()', () => {
    it(
      'should throw an error when the argument is not non-empty arary' +
        ' of numbers',
      () => {
        expect(() => mean([])).toThrow();
      }
    );

    it('should return 0 for the input [ 0 ]', () => {
      const result = mean([0]);

      expect(result).toBe(0);
    });

    it('should return 1 for the input [ 1 ]', () => {
      const result = mean([1]);

      expect(result).toBe(1);
    });

    it('should return 42 for the input [ 42 ]', () => {
      const result = mean([42]);

      expect(result).toBe(42);
    });

    it('should return 21 for the input [ 0, 42 ]', () => {
      const result = mean([0, 42]);

      expect(result).toBe(21);
    });

    it('should return 42 for the input [ 42, 42 ]', () => {
      const result = mean([42, 42]);

      expect(result).toBe(42);
    });

    it('should return 2.4 for the input [ 1, 1, 2, 3, 5 ]', () => {
      const result = mean([1, 1, 2, 3, 5]);
      const expected = 12 / 5;

      expect(result).toBe(expected);
    });
  });

  describe('nearestRankPercentile()', () => {
    it(
      'should throw an error when the argument is not a non-empty arary' +
        ' of numbers',
      () => {
        expect(() => nearestRankPercentile([], 0.5)).toThrow();
      }
    );

    it(
      'should throw an error if the percentile, n, specified is not a number' +
        ' that satisifies the condition 0 < n ≤ 1',
      () => {
        expect(() => nearestRankPercentile([], -1)).toThrow();
        expect(() => nearestRankPercentile([], -0.01)).toThrow();
        expect(() => nearestRankPercentile([], 0)).toThrow();
        expect(() => nearestRankPercentile([], 1.01)).toThrow();
        expect(() => nearestRankPercentile([], 2)).toThrow();
      }
    );

    it(
      'should return the following percentiles for the input' +
        ' [ 65 ]: p25 = 65; p50 = 65; p75 = 65; p100 = 65',
      () => {
        const input = [65];
        const p25 = nearestRankPercentile(input, 0.25);
        const p50 = nearestRankPercentile(input, 0.5);
        const p75 = nearestRankPercentile(input, 0.75);
        const p100 = nearestRankPercentile(input, 1);

        expect(p25).toBe(65);
        expect(p50).toBe(65);
        expect(p75).toBe(65);
        expect(p100).toBe(65);
      }
    );

    // The following examples were taken fromm the Wikipedia entry for
    // {@link https://en.wikipedia.org/wiki/95th_percentile | Percentile}.
    it(
      'should return the following percentiles for the input' +
        ' [ 15, 20, 35, 40, 50 ]: p5 = 15; p30 = 20; p40 = 20; p50 = 35;' +
        '  p100 = 50',
      () => {
        const input = [15, 20, 35, 40, 50];
        const p5 = nearestRankPercentile(input, 0.05);
        const p30 = nearestRankPercentile(input, 0.3);
        const p40 = nearestRankPercentile(input, 0.4);
        const p50 = nearestRankPercentile(input, 0.5);
        const p100 = nearestRankPercentile(input, 1);

        expect(p5).toBe(15);
        expect(p30).toBe(20);
        expect(p40).toBe(20);
        expect(p50).toBe(35);
        expect(p100).toBe(50);
      }
    );

    it(
      'should return the following percentiles for the input' +
        ' [ 3, 6, 7, 8, 8, 10, 13, 15, 16, 20 ]: p25 = 7; p50 = 8; p75 = 15' +
        '  p100 = 20',
      () => {
        const input = [3, 6, 7, 8, 8, 10, 13, 15, 16, 20];
        const p25 = nearestRankPercentile(input, 0.25);
        const p50 = nearestRankPercentile(input, 0.5);
        const p75 = nearestRankPercentile(input, 0.75);
        const p100 = nearestRankPercentile(input, 1);

        expect(p25).toBe(7);
        expect(p50).toBe(8);
        expect(p75).toBe(15);
        expect(p100).toBe(20);
      }
    );

    it(
      'should return the following percentiles for the input' +
        ' [ 3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20 ]: p25 = 7; p50 = 9; p75 = 15' +
        '  p100 = 20',
      () => {
        const input = [3, 6, 7, 8, 8, 9, 10, 13, 15, 16, 20];
        const p25 = nearestRankPercentile(input, 0.25);
        const p50 = nearestRankPercentile(input, 0.5);
        const p75 = nearestRankPercentile(input, 0.75);
        const p100 = nearestRankPercentile(input, 1);

        expect(p25).toBe(7);
        expect(p50).toBe(9);
        expect(p75).toBe(15);
        expect(p100).toBe(20);
      }
    );
  });

  describe('sum()', () => {
    it(
      'should throw an error when the argument is not non-empty array of' +
        ' numbers',
      () => {
        expect(() => sum([])).toThrow();
      }
    );

    it('return 0 for the input [ 0 ]', () => {
      const input = [0];

      expect(sum(input)).toBe(0);
    });

    it('return 42 for the input [ 42 ]', () => {
      const input = [42];

      expect(sum(input)).toBe(42);
    });

    it('return 84 for the input [ 42, 42 ]', () => {
      const input = [42, 42];

      expect(sum(input)).toBe(84);
    });

    it('return 126 for the input [ 21, 42, 63 ]', () => {
      const input = [21, 42, 63];

      expect(sum(input)).toBe(126);
    });

    it('return 30 for the input [ 1, 1, 2, 5, 8, 13 ]', () => {
      const input = [1, 1, 2, 5, 8, 13];

      expect(sum(input)).toBe(30);
    });
  });

  describe('populationStddev()', () => {
    it(
      'should throw an error when the argument is not non-empty array of' +
        ' numbers',
      () => {
        expect(() => populationStddev([])).toThrow();
      }
    );

    it('return 0 for the input [ 0 ]', () => {
      const input = [0];

      expect(populationStddev(input)).toBe(0);
    });

    it('return 0 for the input [ 42 ]', () => {
      const input = [42];

      expect(populationStddev(input)).toBe(0);
    });

    it('return 0 for the input [ 42, 42 ]', () => {
      const input = [42, 42];

      expect(populationStddev(input)).toBe(0);
    });

    it('return √294 for the input [ 21, 42, 63 ]', () => {
      const input = [21, 42, 63];

      expect(populationStddev(input)).toBe(Math.sqrt(294));
    });

    it('return √98 for the input [ 21, 42, 21 ]', () => {
      const input = [21, 21, 42];

      expect(populationStddev(input)).toBe(Math.sqrt(98));
    });

    it('return √(114 / 6) for the input [ 1, 1, 2, 5, 8, 13 ]', () => {
      const input = [1, 1, 2, 5, 8, 13];

      expect(populationStddev(input)).toBe(Math.sqrt(114 / 6));
    });
  });

  describe('populationVariance()', () => {
    it(
      'should throw an error when the argument is not non-empty array of' +
        ' numbers',
      () => {
        expect(() => populationVariance([])).toThrow();
      }
    );

    it('return 0 for the input [ 0 ]', () => {
      const input = [0];

      expect(populationVariance(input)).toBe(0);
    });

    it('return 0 for the input [ 42 ]', () => {
      const input = [42];

      expect(populationVariance(input)).toBe(0);
    });

    it('return 0 for the input [ 42, 42 ]', () => {
      const input = [42, 42];

      expect(populationVariance(input)).toBe(0);
    });

    it('return 294 for the input [ 21, 42, 63 ]', () => {
      const input = [21, 42, 63];

      expect(populationVariance(input)).toBe(294);
    });

    it('return 98 for the input [ 21, 42, 21 ]', () => {
      const input = [21, 21, 42];

      expect(populationVariance(input)).toBe(98);
    });

    it('return 114 / 6 for the input [ 1, 1, 2, 5, 8, 13 ]', () => {
      const input = [1, 1, 2, 5, 8, 13];

      expect(populationVariance(input)).toBe(114 / 6);
    });
  });
});
