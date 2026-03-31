import { SortAlgorithm, SortGenerator } from './types';

/**
 * Merge Sort
 *
 * Time Complexity: O(n log n) for all cases
 * Space Complexity: O(n)
 *
 * Divide and conquer algorithm that divides the array into halves,
 * recursively sorts them, and then merges the sorted halves.
 */
function* mergeSortGenerator(arr: number[]): SortGenerator {
  const sorted: number[] = [];

  function* mergeSort(start: number, end: number): SortGenerator {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    // Recursively sort left half
    yield* mergeSort(start, mid);

    // Recursively sort right half
    yield* mergeSort(mid + 1, end);

    // Merge the sorted halves
    yield* merge(start, mid, end);
  }

  function* merge(start: number, mid: number, end: number): SortGenerator {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      // Compare elements from left and right
      yield { array: [...arr], comparing: [start + i, mid + 1 + j], sorted: [...sorted] };

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      yield { array: [...arr], swapping: [k], sorted: [...sorted] };
      k++;
    }

    // Copy remaining elements from left
    while (i < left.length) {
      arr[k] = left[i];
      yield { array: [...arr], swapping: [k], sorted: [...sorted] };
      i++;
      k++;
    }

    // Copy remaining elements from right
    while (j < right.length) {
      arr[k] = right[j];
      yield { array: [...arr], swapping: [k], sorted: [...sorted] };
      j++;
      k++;
    }

    // Mark merged section if it's the final merge
    if (start === 0 && end === arr.length - 1) {
      for (let idx = start; idx <= end; idx++) {
        sorted.push(idx);
      }
      yield { array: [...arr], sorted: [...sorted] };
    }
  }

  yield* mergeSort(0, arr.length - 1);

  // Mark all as sorted at the end
  if (sorted.length === 0) {
    for (let i = 0; i < arr.length; i++) {
      sorted.push(i);
    }
    yield { array: [...arr], sorted: [...sorted] };
  }
}

const mergeSort: SortAlgorithm = {
  name: 'Merge Sort',
  sort: mergeSortGenerator,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  description: 'Divides array into halves, sorts them, and merges back together.',
  longDescription: 'A divide-and-conquer algorithm that splits the array in half, recursively sorts each half, and then merges the two sorted halves into one. It guarantees O(n log n) performance in all cases.',
  howItWorks: [
    'Divide the array into two equal halves.',
    'Recursively sort the left half.',
    'Recursively sort the right half.',
    'Merge the two sorted halves by comparing elements one by one.',
    'The base case is a single element — it is already sorted.',
  ],
  proTip: {
    title: 'Bottom-Up Variant',
    text: 'Merge sort can be implemented iteratively (bottom-up) by merging pairs of size 1, then size 2, etc. This avoids recursion overhead and is used in production sorting implementations like Timsort.',
  },
  spaceComplexityLabel: 'Linear O(n)',
  spaceComplexityDesc: 'Merge sort requires O(n) auxiliary space for the temporary arrays used during the merge step. This is its main disadvantage compared to in-place algorithms.',
  implementations: {
    js: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
  },
};

export default mergeSort;
