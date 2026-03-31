import { useState, useRef, useCallback, useEffect } from 'react';
import { SortAlgorithm, SortGenerator } from '../algorithms/types';

interface UseSortingAnimationOptions {
  initialArray: number[];
  algorithm: SortAlgorithm;
  speed: number;
}

interface UseSortingAnimationReturn {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  isRunning: boolean;
  isPaused: boolean;
  comparisons: number;
  swaps: number;
  elapsedTime: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  step: () => void;
}

// Lightweight step: only what changed, no full array copy.
// Fixes OOM crash for large arrays (e.g. bubble sort on 1000 elements = ~1M steps
// × 8KB array copy = 8 GB with full storage; here it's ~50 bytes per step).
type PlaybackStep = {
  comparing?: number[];
  swapping?: number[];
  writes?: Array<[number, number]>; // [index, newValue] for each mutated index
  sorted?: number[];
};

type CompiledSteps = {
  steps: PlaybackStep[];
  benchmarkTime: number;
};

export function useSortingAnimation({
  initialArray,
  algorithm,
  speed,
}: UseSortingAnimationOptions): UseSortingAnimationReturn {
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const stepsRef = useRef<PlaybackStep[]>([]);
  const benchmarkTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  // workingArrayRef mirrors the array state at positionRef; writes are applied
  // sequentially so it always reflects the correct intermediate sort state.
  const workingArrayRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const speedRef = useRef<number>(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Compile all algorithm steps as lightweight diffs.
  // Diffs consecutive snapshots to handle generators that yield before OR after
  // mutating (bubble, selection, quick, heap vs merge, counting, radix, etc.).
  const compileSteps = useCallback((sourceArray: number[]): CompiledSteps => {
    const arrayCopy = [...sourceArray];
    const gen: SortGenerator = algorithm.sort(arrayCopy);
    const steps: PlaybackStep[] = [];
    let prev = [...sourceArray];
    const t0 = performance.now();
    let result = gen.next();
    while (!result.done) {
      const v = result.value;
      const writes: Array<[number, number]> = [];
      for (let i = 0; i < v.array.length; i++) {
        if (v.array[i] !== prev[i]) writes.push([i, v.array[i]]);
      }
      steps.push({
        comparing: v.comparing?.length ? v.comparing : undefined,
        swapping: v.swapping?.length ? v.swapping : undefined,
        writes: writes.length ? writes : undefined,
        sorted: v.sorted?.length ? v.sorted : undefined,
      });
      prev = v.array;
      result = gen.next();
    }
    return { steps, benchmarkTime: performance.now() - t0 };
  }, [algorithm]);

  // Apply all writes for steps [from, to) to workingArrayRef.
  const applyWrites = useCallback((from: number, to: number) => {
    const steps = stepsRef.current;
    for (let i = from; i < to; i++) {
      const w = steps[i].writes;
      if (w) {
        for (const [idx, val] of w) workingArrayRef.current[idx] = val;
      }
    }
  }, []);

  // Flush display state from workingArrayRef + step metadata.
  const flushDisplay = useCallback((stepIndex: number) => {
    const step = stepsRef.current[stepIndex];
    setArray([...workingArrayRef.current]);
    setComparing(step.comparing || []);
    setSwapping(step.swapping || []);
    if (step.sorted !== undefined) setSorted(step.sorted);
  }, []);

  const finish = useCallback(() => {
    setElapsedTime(benchmarkTimeRef.current);
    setIsRunning(false);
    setComparing([]);
    setSwapping([]);
    setSorted(Array.from({ length: workingArrayRef.current.length }, (_, i) => i));
  }, []);

  const animate = useCallback(() => {
    const steps = stepsRef.current;
    const totalSteps = steps.length;
    if (totalSteps === 0) return;

    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // Linear speed: speed 100 → animation takes TARGET_MS; speed S → TARGET_MS × (100/S).
    // Timer = (progress) × benchmarkTime, always converges to the same value at every speed.
    const TARGET_MS = 1000;
    const stepsPerMs = totalSteps * (speedRef.current / 100) / TARGET_MS;
    const advance = elapsed * stepsPerMs;

    const prevIndex = Math.floor(positionRef.current);
    positionRef.current = Math.min(positionRef.current + advance, totalSteps);
    const newIndex = Math.min(Math.floor(positionRef.current), totalSteps);

    if (newIndex > prevIndex) {
      // Count stats: 1 comparison per comparing-step, actual write count per step.
      let comps = 0, writes = 0;
      for (let i = prevIndex; i < newIndex; i++) {
        const s = steps[i];
        if (s.comparing?.length) comps += 1;
        writes += s.writes?.length ?? 0;
      }
      if (comps > 0) setComparisons((c) => c + comps);
      if (writes > 0) setSwaps((s) => s + writes);

      // Apply all writes to reach correct state, display last step in batch
      applyWrites(prevIndex, newIndex);
      flushDisplay(newIndex - 1);
      setElapsedTime((positionRef.current / totalSteps) * benchmarkTimeRef.current);
    }

    if (positionRef.current >= totalSteps) {
      finish();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [applyWrites, flushDisplay, finish]);

  const start = useCallback(() => {
    setArray([...initialArray]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);

    workingArrayRef.current = [...initialArray];
    const { steps, benchmarkTime } = compileSteps(initialArray);
    stepsRef.current = steps;
    benchmarkTimeRef.current = benchmarkTime;
    positionRef.current = 0;

    setIsRunning(true);
    setIsPaused(false);
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [initialArray, compileSteps, animate]);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const reset = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    stepsRef.current = [];
    positionRef.current = 0;
    workingArrayRef.current = [...initialArray];
    setArray([...initialArray]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialArray]);

  const step = useCallback(() => {
    if (stepsRef.current.length === 0) {
      workingArrayRef.current = [...initialArray];
      const { steps, benchmarkTime } = compileSteps(initialArray);
      stepsRef.current = steps;
      benchmarkTimeRef.current = benchmarkTime;
      positionRef.current = 0;
      setIsRunning(true);
      setIsPaused(true);
    }

    const totalSteps = stepsRef.current.length;
    const idx = Math.floor(positionRef.current);

    if (idx >= totalSteps) {
      finish();
      return;
    }

    const s = stepsRef.current[idx];
    if (s.comparing?.length) setComparisons((c) => c + 1);
    if (s.writes?.length) setSwaps((sw) => sw + (s.writes?.length ?? 0));

    applyWrites(idx, idx + 1);
    flushDisplay(idx);
    positionRef.current = idx + 1;
    setElapsedTime((positionRef.current / totalSteps) * benchmarkTimeRef.current);

    if (positionRef.current >= totalSteps) finish();
  }, [initialArray, compileSteps, applyWrites, flushDisplay, finish]);

  useEffect(() => {
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  useEffect(() => { reset(); }, [initialArray, algorithm, reset]);

  return {
    array, comparing, swapping, sorted,
    isRunning, isPaused,
    comparisons, swaps, elapsedTime,
    start, pause, resume, reset, step,
  };
}
