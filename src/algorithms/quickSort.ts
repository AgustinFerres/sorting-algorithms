import { SortAlgorithm, SortGenerator } from './types';

/**
 * Quick Sort
 *
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n) due to recursion stack
 *
 * Divide and conquer algorithm that selects a pivot element and partitions
 * the array around it, then recursively sorts the partitions.
 */
function* quickSortGenerator(arr: number[]): SortGenerator {
  const sorted: number[] = [];

  function* quickSort(low: number, high: number): SortGenerator {
    if (low < high) {
      // Partition and get pivot index
      const pivotResult = yield* partition(low, high);
      const pivotIndex = pivotResult;

      // Mark pivot as sorted
      sorted.push(pivotIndex);
      yield { array: [...arr], sorted: [...sorted] };

      // Recursively sort elements before and after partition
      yield* quickSort(low, pivotIndex - 1);
      yield* quickSort(pivotIndex + 1, high);
    } else if (low === high && !sorted.includes(low)) {
      // Single element is sorted
      sorted.push(low);
      yield { array: [...arr], sorted: [...sorted] };
    }
  }

  function* partition(low: number, high: number): Generator<any, number, unknown> {
    // Use middle element as pivot to avoid worst case on sorted arrays
    const mid = Math.floor((low + high) / 2);
    if (mid !== high) {
      yield { array: [...arr], swapping: [mid, high], sorted: [...sorted] };
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
    }

    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Compare current element with pivot
      yield { array: [...arr], comparing: [j, high], sorted: [...sorted] };

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          yield { array: [...arr], swapping: [i, j], sorted: [...sorted] };
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      yield { array: [...arr], swapping: [i + 1, high], sorted: [...sorted] };
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }

    return i + 1;
  }

  yield* quickSort(0, arr.length - 1);

  // Mark all as sorted at the end
  for (let i = 0; i < arr.length; i++) {
    if (!sorted.includes(i)) {
      sorted.push(i);
    }
  }
  yield { array: [...arr], sorted: [...sorted] };
}

const quickSort: SortAlgorithm = {
  name: 'Quick Sort',
  sort: quickSortGenerator,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  description: 'Partitions array around a pivot and recursively sorts partitions.',
  longDescription: 'A highly efficient divide-and-conquer algorithm that selects a pivot element and partitions the array so all elements less than the pivot come before it and all greater come after. It then recursively sorts the two partitions.',
  howItWorks: [
    'Select a pivot element from the array.',
    'Partition: move all elements smaller than the pivot to its left.',
    'Move all elements greater than the pivot to its right.',
    'The pivot is now in its final sorted position.',
    'Recursively apply the same process to the left and right partitions.',
  ],
  proTip: {
    title: 'Pivot Selection',
    text: 'The choice of pivot dramatically affects performance. A bad pivot (always min or max) degrades to O(n²). Median-of-three or random pivot selection avoids worst-case behavior in practice.',
  },
  spaceComplexityLabel: 'Logarithmic O(log n)',
  spaceComplexityDesc: 'Quick sort is in-place but uses O(log n) stack space due to recursion. With tail-call optimization or iterative implementation, this can be reduced further.',
  implementations: {
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  },
};

export default quickSort;
