import { SortAlgorithm, SortGenerator } from './types';

/**
 * Heap Sort
 *
 * Time Complexity: O(n log n) for all cases
 * Space Complexity: O(1)
 *
 * Builds a max-heap from the array, then repeatedly extracts the maximum
 * element and places it at the end of the sorted portion.
 */
function* heapSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  const sorted: number[] = [];

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    yield { array: [...arr], swapping: [0, i], sorted: [...sorted] };
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Mark as sorted
    sorted.unshift(i);
    yield { array: [...arr], sorted: [...sorted] };

    // Heapify the reduced heap
    yield* heapify(i, 0);
  }

  // Mark first element as sorted
  sorted.unshift(0);
  yield { array: [...arr], sorted: [...sorted] };

  function* heapify(heapSize: number, rootIndex: number): SortGenerator {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    // Compare with left child
    if (left < heapSize) {
      yield { array: [...arr], comparing: [largest, left], sorted: [...sorted] };
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    // Compare with right child
    if (right < heapSize) {
      yield { array: [...arr], comparing: [largest, right], sorted: [...sorted] };
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    // If largest is not root
    if (largest !== rootIndex) {
      yield { array: [...arr], swapping: [rootIndex, largest], sorted: [...sorted] };
      [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];

      // Recursively heapify the affected sub-tree
      yield* heapify(heapSize, largest);
    }
  }
}

const heapSort: SortAlgorithm = {
  name: 'Heap Sort',
  sort: heapSortGenerator,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(1)',
  description: 'Builds a max-heap and extracts maximum element repeatedly.',
  longDescription: 'Uses a binary max-heap data structure to sort. First builds a max-heap from the input, then repeatedly extracts the maximum element (root) and places it at the end of the array, reducing the heap size each time.',
  howItWorks: [
    'Build a max-heap from the input array (heapify from bottom up).',
    'The largest element is now at the root (index 0).',
    'Swap the root with the last element of the unsorted region.',
    'Reduce the heap size by one and restore the max-heap property.',
    'Repeat until the heap size is 1 — the array is sorted.',
  ],
  proTip: {
    title: 'Heapsort vs Quicksort',
    text: 'Heap sort guarantees O(n log n) in all cases, unlike quicksort. However, it has worse cache performance due to non-sequential memory access patterns in the heap, making quicksort faster in practice on modern hardware.',
  },
  spaceComplexityLabel: 'Constant O(1)',
  spaceComplexityDesc: 'Heap sort is an in-place algorithm. The heap is built within the original array, requiring no additional storage beyond a few temporary variables.',
  implementations: {
    js: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
  },
};

export default heapSort;
