import { SortAlgorithm, SortGenerator } from './types';

/**
 * Radix Sort (LSD - Least Significant Digit)
 *
 * Time Complexity: O(d * (n + k)) where d is number of digits, k is the base
 * Space Complexity: O(n + k)
 *
 * Non-comparison sort that sorts numbers digit by digit, starting from the
 * least significant digit to the most significant digit.
 * Note: Only works with non-negative integers.
 */
function* radixSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n === 0) return;

  const max = Math.max(...arr);
  const sorted: number[] = [];

  // Process each digit position
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingSortByDigit(exp);
  }

  // Mark all as sorted
  for (let i = 0; i < n; i++) {
    sorted.push(i);
  }
  yield { array: [...arr], sorted: [...sorted] };

  function* countingSortByDigit(exp: number): SortGenerator {
    const output = new Array(n);
    const count = new Array(10).fill(0);

    // Count occurrences of each digit
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      yield { array: [...arr], comparing: [i], sorted: [...sorted] };
    }

    // Calculate cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output array (traverse in reverse for stability)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const idx = count[digit] - 1;
      output[idx] = arr[i];
      count[digit]--;
    }

    // Copy output back to arr
    for (let i = 0; i < n; i++) {
      if (arr[i] !== output[i]) {
        yield { array: [...arr], swapping: [i], sorted: [...sorted] };
      }
      arr[i] = output[i];
    }

    yield { array: [...arr], sorted: [...sorted] };
  }
}

const radixSort: SortAlgorithm = {
  name: 'Radix Sort',
  sort: radixSortGenerator,
  timeComplexity: {
    best: 'O(d(n+k))',
    average: 'O(d(n+k))',
    worst: 'O(d(n+k))',
  },
  spaceComplexity: 'O(n + k)',
  description: 'Sorts by individual digits from least to most significant.',
  longDescription: 'A non-comparison sort that processes integers digit by digit. Starting from the least significant digit (LSD), it performs a stable counting sort for each digit position, gradually ordering all elements.',
  howItWorks: [
    'Find the maximum value to determine the number of digit positions.',
    'Start with the least significant digit (ones place).',
    'Perform a stable sort (counting sort) based on that digit.',
    'Move to the next digit position (tens, hundreds, etc.).',
    'Repeat until all digit positions have been processed.',
  ],
  proTip: {
    title: 'Base Selection',
    text: 'The base (radix) affects performance. Base 10 is intuitive but base 256 processes bytes directly and is much faster in practice. The optimal base depends on the input range and hardware word size.',
  },
  spaceComplexityLabel: 'Linear O(n + k)',
  spaceComplexityDesc: 'Radix sort needs O(n) for the output array and O(k) for the count array at each digit pass, where k is the base (typically 10).',
  implementations: {
    js: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countByDigit(arr, exp);
  }
  return arr;
}

function countByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(arr[i] / exp) % 10;
    output[count[d] - 1] = arr[i];
    count[d]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
  },
};

export default radixSort;
