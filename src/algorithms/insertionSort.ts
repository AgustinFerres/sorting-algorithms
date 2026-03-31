import { SortAlgorithm, SortGenerator } from './types';

/**
 * Insertion Sort
 *
 * Time Complexity: O(n²) average and worst case, O(n) best case (already sorted)
 * Space Complexity: O(1)
 *
 * Builds the final sorted array one item at a time. Takes each element and
 * inserts it into its correct position among the previously sorted elements.
 */
function* insertionSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  const sorted: number[] = [0]; // First element is trivially sorted

  yield { array: [...arr], sorted: [...sorted] };

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Compare with sorted portion
    yield { array: [...arr], comparing: [i, j], sorted: [...sorted] };

    while (j >= 0 && arr[j] > key) {
      yield { array: [...arr], swapping: [j, j + 1], sorted: [...sorted] };

      arr[j + 1] = arr[j];
      j--;

      if (j >= 0) {
        yield { array: [...arr], comparing: [j, j + 1], sorted: [...sorted] };
      }
    }

    arr[j + 1] = key;

    // Mark current element as part of sorted portion
    sorted.push(i);
    yield { array: [...arr], sorted: [...sorted] };
  }
}

const insertionSort: SortAlgorithm = {
  name: 'Insertion Sort',
  sort: insertionSortGenerator,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  description: 'Builds sorted array by inserting each element into its correct position.',
  longDescription: 'Builds the final sorted array one element at a time. It picks each element from the unsorted part and inserts it into the correct position in the already-sorted part, shifting elements as needed.',
  howItWorks: [
    'Start with the second element — consider the first element already sorted.',
    'Compare the current element with the largest in the sorted region.',
    'Shift all larger sorted elements one position to the right.',
    'Insert the current element into its correct position.',
    'Repeat for each remaining unsorted element.',
  ],
  proTip: {
    title: 'Nearly Sorted Data',
    text: 'Insertion sort is highly efficient on nearly sorted data, running close to O(n). It is often used as a final step in hybrid algorithms like Timsort (Python, Java) for small sub-arrays.',
  },
  spaceComplexityLabel: 'Constant O(1)',
  spaceComplexityDesc: 'Insertion sort is in-place. Sorting happens within the original array using only a single temporary variable to hold the current key.',
  implementations: {
    js: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  },
};

export default insertionSort;
