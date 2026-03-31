import { SortAlgorithm, SortGenerator } from './types';

/**
 * Bucket Sort
 *
 * Time Complexity: O(n + k) average, O(n²) worst case
 * Space Complexity: O(n)
 *
 * Distributes elements into buckets, sorts each bucket (using insertion sort),
 * and concatenates the buckets. Works best when input is uniformly distributed.
 */
function* bucketSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  if (n === 0) return;

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const sorted: number[] = [];

  // Create buckets
  const bucketCount = Math.max(Math.floor(Math.sqrt(n)), 1);
  const range = (max - min) / bucketCount + 1;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    yield { array: [...arr], comparing: [i], sorted: [...sorted] };
    const bucketIndex = Math.min(
      Math.floor((arr[i] - min) / range),
      bucketCount - 1
    );
    buckets[bucketIndex].push(arr[i]);
  }

  // Sort each bucket using insertion sort
  for (let i = 0; i < bucketCount; i++) {
    yield* insertionSortBucket(buckets[i]);
  }

  // Concatenate all buckets back to array
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index] = buckets[i][j];
      sorted.push(index);
      yield { array: [...arr], swapping: [index], sorted: [...sorted] };
      index++;
    }
  }

  function* insertionSortBucket(bucket: number[]): SortGenerator {
    for (let i = 1; i < bucket.length; i++) {
      const key = bucket[i];
      let j = i - 1;

      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j];
        j--;
      }
      bucket[j + 1] = key;
    }
    // Yield to show progress
    yield { array: [...arr], sorted: [...sorted] };
  }
}

const bucketSort: SortAlgorithm = {
  name: 'Bucket Sort',
  sort: bucketSortGenerator,
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(n)',
  description: 'Distributes elements into buckets, sorts each, and concatenates.',
  longDescription: 'Distributes elements into a fixed number of buckets based on their value range, sorts each bucket individually (using insertion sort), and concatenates all buckets to produce the sorted output.',
  howItWorks: [
    'Determine the value range and divide it into equal-sized buckets.',
    'Distribute each element into its corresponding bucket.',
    'Sort each individual bucket using insertion sort.',
    'Concatenate all buckets in order.',
    'The result is the fully sorted array.',
  ],
  proTip: {
    title: 'Uniform Distribution',
    text: 'Bucket sort achieves O(n) average time when elements are uniformly distributed, since each bucket contains roughly the same number of elements. Skewed distributions cause many elements to pile into few buckets, degrading to O(n²).',
  },
  spaceComplexityLabel: 'Linear O(n)',
  spaceComplexityDesc: 'Bucket sort uses O(n) extra space across all buckets combined, plus O(k) for the bucket array structure itself.',
  implementations: {
    js: `function bucketSort(arr) {
  const n = arr.length;
  const max = Math.max(...arr), min = Math.min(...arr);
  const bucketCount = Math.floor(Math.sqrt(n));
  const range = (max - min) / bucketCount + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  for (const val of arr) {
    const idx = Math.min(Math.floor((val - min) / range), bucketCount - 1);
    buckets[idx].push(val);
  }

  return buckets.flatMap(b => b.sort((a, c) => a - c));
}`,
  },
};

export default bucketSort;
