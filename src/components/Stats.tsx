import React from 'react';
import { SortAlgorithm } from '../algorithms/types';

interface StatsProps {
  comparisons: number;
  swaps: number;
  elapsedTime: number;
  algorithm: SortAlgorithm;
}

const formatTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(1);
  return `${minutes}m ${remainingSeconds}s`;
};

export const Stats: React.FC<StatsProps> = ({
  comparisons,
  swaps,
  elapsedTime,
  algorithm,
}) => {
  return (
    <div className="stats">
      <div className="stats-counters">
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value timer">{formatTime(elapsedTime)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Comparisons:</span>
          <span className="stat-value">{comparisons}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Array Accesses:</span>
          <span className="stat-value">{swaps}</span>
        </div>
      </div>

      <div className="algorithm-info">
        <h3>{algorithm.name}</h3>
        <p>{algorithm.description}</p>
        <div className="complexity">
          <div>
            <strong>Time Complexity:</strong>
            <ul>
              <li>Best: {algorithm.timeComplexity.best}</li>
              <li>Average: {algorithm.timeComplexity.average}</li>
              <li>Worst: {algorithm.timeComplexity.worst}</li>
            </ul>
          </div>
          <div>
            <strong>Space Complexity:</strong> {algorithm.spaceComplexity}
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Unsorted</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Swapping</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
};
