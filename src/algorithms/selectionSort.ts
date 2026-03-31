import { SortAlgorithm, SortGenerator } from './types';

/**
 * Selection Sort
 *
 * Time Complexity: O(n²) for all cases
 * Space Complexity: O(1)
 *
 * Divides the array into sorted and unsorted regions. Repeatedly finds the
 * minimum element from the unsorted region and moves it to the sorted region.
 */
function* selectionSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Find minimum element in unsorted portion
    for (let j = i + 1; j < n; j++) {
      yield { array: [...arr], comparing: [minIdx, j], sorted: [...sorted] };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap if minimum is not at current position
    if (minIdx !== i) {
      yield { array: [...arr], swapping: [i, minIdx], sorted: [...sorted] };
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // Mark current position as sorted
    sorted.push(i);
    yield { array: [...arr], sorted: [...sorted] };
  }

  // Mark last element as sorted
  sorted.push(n - 1);
  yield { array: [...arr], sorted: [...sorted] };
}

const selectionSort: SortAlgorithm = {
  name: 'Selection Sort',
  sort: selectionSortGenerator,
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  description: 'Finds the minimum element and places it at the beginning repeatedly.',
  longDescription: 'Divides the array into a sorted and unsorted region. On each pass, it finds the minimum element in the unsorted region and moves it to the end of the sorted region. Unlike bubble sort, it makes at most n-1 swaps.',
  howItWorks: [
    'Find the minimum element in the entire unsorted array.',
    'Swap it with the first element of the unsorted region.',
    'Expand the sorted region by one position to the right.',
    'Repeat from the next unsorted position.',
    'Continue until the entire array is sorted.',
  ],
  proTip: {
    title: 'Minimizing Swaps',
    text: 'Selection sort makes at most n-1 swaps — fewer than bubble or insertion sort. This makes it useful in situations where the cost of swapping is high, such as writing to flash memory.',
  },
  spaceComplexityLabel: 'Constant O(1)',
  spaceComplexityDesc: 'Selection sort is an in-place algorithm. It only uses a fixed number of variables regardless of input size — no extra arrays needed.',
  implementations: {
    js: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
  },
};

export default selectionSort;
