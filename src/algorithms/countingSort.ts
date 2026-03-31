import { SortAlgorithm, SortGenerator } from './types';

/**
 * Counting Sort
 *
 * Time Complexity: O(n + k) where k is the range of input
 * Space Complexity: O(k)
 *
 * Non-comparison sort that counts occurrences of each element and uses
 * the counts to determine positions in the sorted output.
 * Note: Only works with non-negative integers.
 */
function* countingSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n === 0) return;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // Count occurrences
  const count = new Array(range).fill(0);
  const output = new Array(n);
  const sorted: number[] = [];

  // Store count of each element
  for (let i = 0; i < n; i++) {
    yield { array: [...arr], comparing: [i], sorted: [...sorted] };
    count[arr[i] - min]++;
  }

  // Calculate cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (traverse in reverse for stability)
  for (let i = n - 1; i >= 0; i--) {
    yield { array: [...arr], comparing: [i], sorted: [...sorted] };
    const idx = count[arr[i] - min] - 1;
    output[idx] = arr[i];
    count[arr[i] - min]--;
  }

  // Copy output back to arr and show progress
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    sorted.push(i);
    yield { array: [...arr], swapping: [i], sorted: [...sorted] };
  }
}

const countingSort: SortAlgorithm = {
  name: 'Counting Sort',
  sort: countingSortGenerator,
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
  },
  spaceComplexity: 'O(k)',
  description: 'Counts occurrences and calculates positions. Works with integers only.',
  longDescription: 'A non-comparison sorting algorithm that counts the number of occurrences of each distinct element. It uses these counts to calculate the correct position of each element in the output array.',
  howItWorks: [
    'Find the range of input values (min to max).',
    'Count how many times each value appears.',
    'Compute prefix sums to determine each value\'s output position.',
    'Place each element into its correct output position.',
    'Copy the output back to the original array.',
  ],
  proTip: {
    title: 'Range Matters',
    text: 'Counting sort is extremely fast when the range k is small relative to n. However, if k is much larger than n (e.g., sorting 10 numbers in range 0–1,000,000), the O(k) space and time overhead makes it impractical.',
  },
  spaceComplexityLabel: 'Linear O(k)',
  spaceComplexityDesc: 'Counting sort requires O(k) space for the count array where k is the range of input values, plus O(n) for the output array.',
  implementations: {
    js: `function countingSort(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  for (const val of arr) count[val - min]++;
  for (let i = 1; i < range; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  return output;
}`,
  },
};

export default countingSort;
