import { SortAlgorithm, SortGenerator } from './types';

/**
 * Bubble Sort
 *
 * Time Complexity: O(n²) average and worst case, O(n) best case (already sorted)
 * Space Complexity: O(1)
 *
 * Repeatedly steps through the list, compares adjacent elements and swaps them
 * if they are in the wrong order. The pass through the list is repeated until
 * the list is sorted.
 */
function* bubbleSortGenerator(arr: number[]): SortGenerator {
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Yield comparing state
      yield { array: [...arr], comparing: [j, j + 1], sorted: [...sorted] };

      if (arr[j] > arr[j + 1]) {
        // Yield swapping state
        yield { array: [...arr], swapping: [j, j + 1], sorted: [...sorted] };

        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Mark the last element of this pass as sorted
    sorted.unshift(n - i - 1);
    yield { array: [...arr], sorted: [...sorted] };

    // If no swapping occurred, array is sorted
    if (!swapped) {
      // Mark all remaining as sorted
      for (let k = 0; k < n - i - 1; k++) {
        sorted.unshift(k);
      }
      yield { array: [...arr], sorted: [...sorted] };
      break;
    }
  }

  // Ensure first element is marked as sorted
  if (!sorted.includes(0)) {
    sorted.unshift(0);
  }
  yield { array: [...arr], sorted: [...sorted] };
}

const bubbleSort: SortAlgorithm = {
  name: 'Bubble Sort',
  sort: bubbleSortGenerator,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  description: 'Repeatedly compares adjacent elements and swaps them if out of order.',
  longDescription: 'A simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
  howItWorks: [
    'Compare the first and second elements.',
    'If the first is greater than the second, swap them.',
    'Move to the next pair and repeat until the end.',
    'After each pass, the largest unsorted element is in its final position.',
    'Repeat passes over the unsorted portion until no swaps occur.',
  ],
  proTip: {
    title: 'Early Termination',
    text: 'You can optimize bubble sort by checking if any swaps occurred in a pass. If no swaps were made, the array is already sorted and you can exit immediately — making best-case performance O(n).',
  },
  spaceComplexityLabel: 'Constant O(1)',
  spaceComplexityDesc: 'Bubble sort is an in-place sorting algorithm, requiring only a small, constant amount of additional storage space for swaps.',
  implementations: {
    js: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
  },
};

export default bubbleSort;
