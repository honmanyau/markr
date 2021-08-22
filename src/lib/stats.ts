/**
 * This function calculates and returns the mean of the numbers in an array.
 * 
 * @param {number[]} nums An array of numbers.
 * @returns {number} The mean of the values in the input array.
 */
export function mean(nums: number[]): number {
  throwIfEmpty(nums, 'mean()');

  const result = sum(nums) / nums.length;
  
  validateNumber(result, 'mean()');

  return result;
}

/**
 * This function calculates the n-th percentile of the given array using
 * the {@link https://en.wikipedia.org/wiki/95th_percentile | nearest-rank}
 * method.
 * 
 * @param {number[]} nums An array of numbers.
 * @param {number} n The precentile to calculate.
 * @returns {number} The n-th percentile of the input array.
 */
export function nearestRankPercentile(nums: number[], n: number): number {
  throwIfEmpty(nums);

  let sum = -Infinity;

  return sum;
}

// /**
//  * This function calculates the sample standard deviation of the given array.
//  * 
//  * @param {number[]} nums An array of numbers.
//  * @param {number} n The precentile to calculate.
//  * @returns {number} The n-th percentile of the input array.
//  */
//  export function sampleStddev(nums: number[]): number {
//   let sum = -Infinity;

//   return sum;
// }

/**
 * This function calculates the sum of the given array.
 * 
 * @param {number[]} nums An array of numbers.
 * @returns {number} The sum of all numbers in the input array.
 */
 export function sum(nums: number[]): number {
  throwIfEmpty(nums, 'sum()');

  let result = 0;

  for (const num of nums) {
    result += num;
  }

  validateNumber(result, 'sum()');

  return result;
}

/**
 * This function calculates the population standard deviation of the given
 * array.
 * 
 * @param {number[]} nums An array of numbers.
 * @param {number} n The precentile to calculate.
 * @returns {number} The population standard deviation of the input array.
 */
 export function populationStddev(nums: number[]): number {
  throwIfEmpty(nums);

  let sum = -Infinity;

  return sum;
}

/**
 * This function calculates the population variance of the given array.
 *
 * @param {number[]} nums An array of numbers.
 * @param {number} n The precentile to calculate.
 * @returns {number} The population variance of the input array.
 */
 export function populationVariance(nums: number[]): number {
  throwIfEmpty(nums);

  let sum = -Infinity;

  return sum;
}

/**
 * This function throws an error if the given array is empty.
 * 
 * @param {any[]} arr An array.
 * @param {string} [name="This function"] An optional parameter for
 *     specifying the name of the function that is throwing an error.
 */
function throwIfEmpty(arr: any[], name = 'This function') {
  if (arr.length === 0) {
    throw new Error(`${name} only accepts a non-empty array of numbers.`);
  }
}

/**
 * This function throws an error if the given number is not a number.
 * 
 * @param {any} value A value that is supposed to be a number.
 * @param {string} [name="This function"] An optional parameter for
 *     specifying the name of the function that is throwing an error.
 */
 function validateNumber(value: number, name = 'This function') {
  if (
    !Number.isFinite(value) ||
    Number.isNaN(value) ||
    typeof value !== 'number'
  ) {
    throw new Error(`${name} only accepts a non-empty array of numbers.`);
  }
}