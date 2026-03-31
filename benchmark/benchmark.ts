/**
 * Benchmark CLI for Sorting Algorithms
 *
 * Tests all sorting algorithms with various array sizes and types.
 * Run with: npm run benchmark
 */

// Direct implementations for benchmarking (no generators for speed)

function bubbleSort(arr: number[]): void {
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
}

function selectionSort(arr: number[]): void {
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
}

function insertionSort(arr: number[]): void {
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
}

function mergeSort(arr: number[]): void {
  if (arr.length <= 1) return;

  const merge = (left: number[], right: number[]): number[] => {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  };

  const sort = (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sort(arr.slice(0, mid));
    const right = sort(arr.slice(mid));
    return merge(left, right);
  };

  const sorted = sort(arr);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = sorted[i];
  }
}

function quickSort(arr: number[]): void {
  // Use middle element as pivot to avoid worst case on sorted arrays
  const partition = (low: number, high: number): number => {
    // Choose middle element as pivot and swap to end
    const mid = Math.floor((low + high) / 2);
    [arr[mid], arr[high]] = [arr[high], arr[mid]];

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
  };

  // Iterative quicksort to avoid stack overflow
  const stack: number[] = [];
  stack.push(0);
  stack.push(arr.length - 1);

  while (stack.length > 0) {
    const high = stack.pop()!;
    const low = stack.pop()!;

    if (low < high) {
      const pi = partition(low, high);

      // Push smaller partition first for better stack usage
      if (pi - low < high - pi) {
        stack.push(pi + 1);
        stack.push(high);
        stack.push(low);
        stack.push(pi - 1);
      } else {
        stack.push(low);
        stack.push(pi - 1);
        stack.push(pi + 1);
        stack.push(high);
      }
    }
  }
}

function heapSort(arr: number[]): void {
  const n = arr.length;

  const heapify = (size: number, root: number): void => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      heapify(size, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
}

function countingSort(arr: number[]): void {
  if (arr.length === 0) return;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
}

function radixSort(arr: number[]): void {
  if (arr.length === 0) return;
  const max = Math.max(...arr);

  const countingSortByDigit = (exp: number): void => {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(exp);
  }
}

function bucketSort(arr: number[]): void {
  if (arr.length === 0) return;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const bucketCount = Math.max(Math.floor(Math.sqrt(arr.length)), 1);
  const range = (max - min) / bucketCount + 1;
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.min(
      Math.floor((arr[i] - min) / range),
      bucketCount - 1
    );
    buckets[bucketIndex].push(arr[i]);
  }

  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
  }

  let index = 0;
  for (const bucket of buckets) {
    for (const val of bucket) {
      arr[index++] = val;
    }
  }
}

// Benchmark utilities
interface Algorithm {
  name: string;
  fn: (arr: number[]) => void;
}

const algorithms: Algorithm[] = [
  { name: 'Bubble Sort', fn: bubbleSort },
  { name: 'Selection Sort', fn: selectionSort },
  { name: 'Insertion Sort', fn: insertionSort },
  { name: 'Merge Sort', fn: mergeSort },
  { name: 'Quick Sort', fn: quickSort },
  { name: 'Heap Sort', fn: heapSort },
  { name: 'Counting Sort', fn: countingSort },
  { name: 'Radix Sort', fn: radixSort },
  { name: 'Bucket Sort', fn: bucketSort },
];

const arraySizes = [100, 1000, 5000, 10000];

type ArrayType = 'random' | 'sorted' | 'reverse' | 'nearly-sorted';

function generateArray(size: number, type: ArrayType): number[] {
  switch (type) {
    case 'random':
      return Array.from({ length: size }, () => Math.floor(Math.random() * 10000));
    case 'sorted':
      return Array.from({ length: size }, (_, i) => i);
    case 'reverse':
      return Array.from({ length: size }, (_, i) => size - i);
    case 'nearly-sorted': {
      const arr = Array.from({ length: size }, (_, i) => i);
      // Swap ~5% of elements
      const swaps = Math.floor(size * 0.05);
      for (let i = 0; i < swaps; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      }
      return arr;
    }
  }
}

function benchmark(fn: (arr: number[]) => void, arr: number[]): number {
  const copy = [...arr];
  const start = performance.now();
  fn(copy);
  const end = performance.now();
  return end - start;
}

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function verifySorting(): void {
  console.log('Verifying sorting correctness...\n');
  let allPassed = true;

  for (const algo of algorithms) {
    const testArr = generateArray(100, 'random');
    const copy = [...testArr];
    algo.fn(copy);

    if (isSorted(copy)) {
      console.log(`  ✓ ${algo.name} - PASSED`);
    } else {
      console.log(`  ✗ ${algo.name} - FAILED`);
      allPassed = false;
    }
  }

  console.log(allPassed ? '\nAll algorithms verified!\n' : '\nSome algorithms failed!\n');
}

function runBenchmarks(): void {
  console.log('Running benchmarks...\n');
  console.log('=' .repeat(100));

  const arrayTypes: ArrayType[] = ['random', 'sorted', 'reverse', 'nearly-sorted'];

  for (const type of arrayTypes) {
    console.log(`\n${type.toUpperCase()} ARRAY:\n`);

    // Header
    const header = 'Algorithm'.padEnd(20) +
      arraySizes.map(s => `n=${s}`.padStart(12)).join('');
    console.log(header);
    console.log('-'.repeat(header.length));

    for (const algo of algorithms) {
      const times: string[] = [];

      for (const size of arraySizes) {
        // Skip O(n²) algorithms for large arrays
        if (size >= 5000 && ['Bubble Sort', 'Selection Sort', 'Insertion Sort'].includes(algo.name)) {
          times.push('skipped'.padStart(12));
          continue;
        }

        const arr = generateArray(size, type);
        const time = benchmark(algo.fn, arr);
        times.push(`${time.toFixed(2)}ms`.padStart(12));
      }

      console.log(algo.name.padEnd(20) + times.join(''));
    }

    console.log('-'.repeat(header.length));
  }

  console.log('\n' + '='.repeat(100));
  console.log('\nNote: O(n²) algorithms skipped for n >= 5000 due to performance.');
}

// Main
console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║           SORTING ALGORITHMS BENCHMARK                       ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

verifySorting();
runBenchmarks();

console.log('\nBenchmark complete!\n');
