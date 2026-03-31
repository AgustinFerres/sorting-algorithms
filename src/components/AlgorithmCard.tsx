import { forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { SortAlgorithm } from '../algorithms/types';
import { useSortingAnimation } from '../hooks/useSortingAnimation';
import { ArrayBars } from './ArrayBars';
import { Tooltip } from './Tooltip';
import { colors } from '../styles/theme';

export interface AlgorithmCardHandle {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

interface AlgorithmCardProps {
  algorithm: SortAlgorithm;
  initialArray: number[];
  speed: number;
  onDone?: () => void;
}

const CardWrapper = styled.div<{ $running: boolean; $done: boolean }>`
  background: ${colors.surface};
  border-radius: 10px;
  padding: 16px;
  border: 2px solid ${({ $running, $done }) =>
    $done ? colors.green : $running ? colors.blue : 'transparent'};
  transition: border-color 0.3s ease;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
`;

const CardStats = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.82rem;
  color: ${colors.textMuted};
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
`;

const CardStatTime = styled.span`
  color: ${colors.green};
  font-weight: bold;
`;

const CardStat = styled.span`
  color: ${colors.textMuted};
`;

const CardBarsWrapper = styled.div`
  margin-bottom: 10px;
`;

const CardComplexity = styled.div`
  font-size: 0.78rem;
  color: ${colors.textDim};
  display: flex;
  gap: 6px;
`;

const ComplexitySep = styled.span`
  color: #444;
`;

const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

export const AlgorithmCard = forwardRef<AlgorithmCardHandle, AlgorithmCardProps>(
  ({ algorithm, initialArray, speed, onDone }, ref) => {
    const {
      array, comparing, swapping, sorted,
      comparisons, swaps, elapsedTime,
      isRunning, isPaused,
      start, pause, resume, reset,
    } = useSortingAnimation({ initialArray, algorithm, speed });

    const maxValue = useMemo(() => Math.max(...initialArray), [initialArray]);

    const isDone = sorted.length >= array.length && array.length > 0 && !isRunning;

    useEffect(() => {
      if (isDone) onDone?.();
    }, [isDone]);

    useImperativeHandle(ref, () => ({ start, pause, resume, reset }), [start, pause, resume, reset]);

    return (
      <CardWrapper $running={isRunning && !isPaused} $done={isDone}>
        <CardHeader>
          <CardTitle>{algorithm.name}</CardTitle>
          <CardStats>
            <CardStatTime>
              {formatTime(elapsedTime)}
              <Tooltip text="Real benchmark time — how long the algorithm actually takes to sort this array at full speed (speed 100). The same value is shown at any playback speed." />
            </CardStatTime>
            <CardStat>{comparisons} cmp</CardStat>
            <CardStat>{swaps} writes</CardStat>
          </CardStats>
        </CardHeader>
        <CardBarsWrapper>
          <ArrayBars
            array={array}
            comparing={comparing}
            swapping={swapping}
            sorted={sorted}
            maxValue={maxValue}
          />
        </CardBarsWrapper>
        <CardComplexity>
          <span>{algorithm.timeComplexity.average}</span>
          <ComplexitySep>·</ComplexitySep>
          <span>Space {algorithm.spaceComplexity}</span>
        </CardComplexity>
      </CardWrapper>
    );
  }
);
