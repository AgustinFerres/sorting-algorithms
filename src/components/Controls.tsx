import React from 'react';
import styled, { css } from 'styled-components';
import { colors } from '../styles/theme';
import { Tooltip } from './Tooltip';

interface ControlsProps {
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onGenerateArray: () => void;
}

const ControlsWrapper = styled.div`
  position: sticky;
  top: 20px;
  background: ${colors.surface};
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;

  label {
    font-size: 0.9rem;
    color: ${colors.textMuted};
    display: flex;
    align-items: center;
  }

  input[type='range'] {
    -webkit-appearance: none;
    height: 8px;
    background: ${colors.surfaceDeep};
    border-radius: 4px;
    border: 1px solid ${colors.border};
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: ${colors.blue};
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${colors.blue};
      cursor: pointer;
    }
  }
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    justify-content: center;
  }
`;

type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'danger';

const variantStyles = {
  primary: css`
    background: ${colors.blue};
    color: white;
    &:hover:not(:disabled) { background: ${colors.blueDark}; }
  `,
  secondary: css`
    background: ${colors.gray};
    color: white;
    &:hover:not(:disabled) { background: ${colors.grayDark}; }
  `,
  warning: css`
    background: ${colors.yellow};
    color: ${colors.bg};
    &:hover:not(:disabled) { background: ${colors.yellowDark}; }
  `,
  danger: css`
    background: ${colors.red};
    color: white;
    &:hover:not(:disabled) { background: ${colors.redDark}; }
  `,
};

const Button = styled.button<{ $variant?: ButtonVariant }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant = 'primary' }) => variantStyles[$variant]}
`;

export const Controls: React.FC<ControlsProps> = ({
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onGenerateArray,
}) => {
  return (
    <ControlsWrapper>
      <ControlGroup>
        <label htmlFor="size">Array Size: {arraySize}</label>
        <input
          id="size"
          type="range"
          min="10"
          max="100"
          value={arraySize}
          onChange={(e) => onArraySizeChange(Number(e.target.value))}
          disabled={isRunning && !isPaused}
        />
      </ControlGroup>

      <ControlGroup>
        <label htmlFor="speed">
          Speed: {speed}
          <Tooltip text="Controls animation playback speed. At 100 the animation runs at 1× and the timer shows real benchmark time. Lower speeds slow the animation proportionally — speed 50 is 2× slower, speed 1 is 100× slower." />
        </label>
        <input
          id="speed"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </ControlGroup>

      <ControlButtons>
        {!isRunning ? (
          <Button $variant="primary" onClick={onStart}>Start All</Button>
        ) : isPaused ? (
          <Button $variant="primary" onClick={onResume}>Resume All</Button>
        ) : (
          <Button $variant="warning" onClick={onPause}>Pause All</Button>
        )}

        <Button $variant="danger" onClick={onReset}>Reset All</Button>

        <Button
          $variant="secondary"
          onClick={onGenerateArray}
          disabled={isRunning && !isPaused}
        >
          New Array
        </Button>
      </ControlButtons>
    </ControlsWrapper>
  );
};
