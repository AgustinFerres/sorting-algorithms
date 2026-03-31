# Algorithmic Atelier

An interactive sorting algorithm visualizer built with React and TypeScript. Select an algorithm from the sidebar, control the animation speed, and explore how each algorithm works — step by step.

## Features

- **9 Sorting Algorithms** — from O(n²) classics to O(n log n) and non-comparison sorts
- **Pre-record + replay architecture** — animation speed is fully decoupled from benchmark time; the timer always reflects real sorting performance regardless of playback speed
- **Per-algorithm detail view** — long description, complexity badges, "how it works" steps, space complexity card, pro tip, and a JS reference implementation
- **Live statistics** — comparison count, write count, and benchmark timer updated in real time
- **Memory-efficient step storage** — stores only array mutations (diffs), not full snapshots, making large arrays viable without OOM crashes
- **CLI benchmark** — compare all algorithms across different array types and sizes in the terminal

## Algorithms

| Category | Algorithm | Time (avg) | Space |
|---|---|---|---|
| O(n²) | Bubble Sort | O(n²) | O(1) |
| O(n²) | Selection Sort | O(n²) | O(1) |
| O(n²) | Insertion Sort | O(n²) | O(1) |
| O(n log n) | Merge Sort | O(n log n) | O(n) |
| O(n log n) | Quick Sort | O(n log n) | O(log n) |
| O(n log n) | Heap Sort | O(n log n) | O(1) |
| Non-comparison | Counting Sort | O(n + k) | O(k) |
| Non-comparison | Radix Sort | O(d(n+k)) | O(n + k) |
| Non-comparison | Bucket Sort | O(n + k) | O(n) |

## Getting Started

```bash
npm install
npm run dev
```

### CLI Benchmark

```bash
npm run benchmark
```

## Tech Stack

- React 18 + TypeScript
- Vite
- styled-components

## License

MIT
