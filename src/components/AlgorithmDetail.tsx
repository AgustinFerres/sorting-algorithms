import { useMemo, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { SortAlgorithm } from '../algorithms/types';
import { useSortingAnimation } from '../hooks/useSortingAnimation';
import { ArrayBars } from './ArrayBars';
import { StatusBadges } from './StatusBadges';
import { HowItWorks } from './HowItWorks';
import { SpaceComplexityCard } from './SpaceComplexityCard';
import { ProTipCard } from './ProTipCard';
import { ReferenceImplementation } from './ReferenceImplementation';
import { colors, fonts } from '../styles/theme';

export interface AlgorithmDetailHandle {
  reset: () => void;
}

interface AlgorithmDetailProps {
  algorithm: SortAlgorithm;
  initialArray: number[];
  speed: number;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
}

// --- Layout ---

const DetailWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 36px 48px 60px;
`;

const AlgoHeading = styled.div`
  margin-bottom: 24px;
`;

const AlgoTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 12px;
  line-height: 1.15;

  em {
    font-style: italic;
    color: ${colors.blue};
  }
`;

const AlgoDescription = styled.p`
  font-size: 0.95rem;
  color: ${colors.textMuted};
  line-height: 1.65;
  max-width: 680px;
`;

const ComplexityRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const ComplexityCard = styled.div`
  background: ${colors.surfaceDeep};
  border: 1px solid ${colors.border};
  border-radius: 6px;
  padding: 12px 20px;
  min-width: 110px;
`;

const ComplexityLabel = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${colors.textDim};
  margin-bottom: 6px;
`;

const ComplexityValue = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.blue};
  font-family: ${fonts.mono};
`;

// --- Controls ---

const ControlsStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CtrlBtn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 5px;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? `background: ${colors.blue}; color: #000;
         &:hover { background: ${colors.blueDark}; }`
      : `background: ${colors.surface}; color: ${colors.textMuted}; border: 1px solid ${colors.border};
         &:hover { background: ${colors.surfaceHover}; color: ${colors.text}; }`}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SpeedGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 160px;
`;

const SpeedTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlLabel = styled.span`
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.textDim};
`;

const SpeedValue = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.blue};
  font-family: ${fonts.mono};
`;

const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: ${colors.surfaceHover};
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${colors.blue};
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const ArraySizeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const PresetButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const PresetBtn = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid ${({ $active }) => ($active ? colors.blue : colors.border)};
  background: ${({ $active }) => ($active ? 'rgba(0,180,255,0.12)' : 'none')};
  color: ${({ $active }) => ($active ? colors.blue : colors.textMuted)};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.12s;

  &:hover:not(:disabled) {
    border-color: ${colors.blue};
    color: ${colors.blue};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// --- Visualization ---

const VisualizationPanel = styled.div`
  position: relative;
  background: #0a0a0a;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 36px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${colors.border};
`;

const Stat = styled.span`
  font-size: 0.78rem;
  color: ${colors.textDim};

  strong {
    color: ${colors.textMuted};
    font-weight: 600;
  }
`;

const Timer = styled.span`
  font-size: 0.78rem;
  color: ${colors.green};
  font-weight: 600;
  font-family: ${fonts.mono};
  margin-left: auto;
`;

// --- Lower section ---

const LowerSection = styled.div`
  display: flex;
  gap: 28px;
  align-items: flex-start;
`;

const SideCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 300px;
  min-width: 300px;
`;

// --- Helpers ---

const splitTitle = (name: string): [string, string] => {
  const words = name.split(' ');
  if (words.length <= 1) return ['', name];
  return [words.slice(0, -1).join(' ') + ' ', words[words.length - 1]];
};

const speedToMs = (speed: number): string => {
  if (speed >= 100) return '1000ms';
  if (speed <= 2) return '∞';
  return `${Math.round(1000 * 100 / speed)}ms`;
};

const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0).padStart(3, '0')}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// ---

export const AlgorithmDetail = forwardRef<AlgorithmDetailHandle, AlgorithmDetailProps>(
  ({ algorithm, initialArray, speed, arraySize, onArraySizeChange, onSpeedChange }, ref) => {
    const {
      array, comparing, swapping, sorted,
      comparisons, swaps, elapsedTime,
      isRunning, isPaused,
      start, pause, resume, reset,
    } = useSortingAnimation({ initialArray, algorithm, speed });

    const maxValue = useMemo(() => Math.max(...initialArray) || 1, [initialArray]);
    const [titlePrefix, titleLast] = splitTitle(algorithm.name);

    useImperativeHandle(ref, () => ({ reset }), [reset]);

    return (
      <DetailWrapper>
        <AlgoHeading>
          <AlgoTitle>
            {titlePrefix}<em>{titleLast}</em>
          </AlgoTitle>
          <AlgoDescription>{algorithm.longDescription}</AlgoDescription>
        </AlgoHeading>

        <ComplexityRow>
          <ComplexityCard>
            <ComplexityLabel>Best Case</ComplexityLabel>
            <ComplexityValue>{algorithm.timeComplexity.best}</ComplexityValue>
          </ComplexityCard>
          <ComplexityCard>
            <ComplexityLabel>Average</ComplexityLabel>
            <ComplexityValue>{algorithm.timeComplexity.average}</ComplexityValue>
          </ComplexityCard>
          <ComplexityCard>
            <ComplexityLabel>Space</ComplexityLabel>
            <ComplexityValue>{algorithm.spaceComplexity}</ComplexityValue>
          </ComplexityCard>
        </ComplexityRow>

        <ControlsStrip>
          {!isRunning ? (
            <CtrlBtn $variant="primary" onClick={start}>▶ Start</CtrlBtn>
          ) : isPaused ? (
            <CtrlBtn $variant="primary" onClick={resume}>▶ Resume</CtrlBtn>
          ) : (
            <CtrlBtn $variant="ghost" onClick={pause}>⏸ Pause</CtrlBtn>
          )}
          <CtrlBtn $variant="ghost" onClick={reset}>↺ Reset</CtrlBtn>

          <SpeedGroup>
            <SpeedTopRow>
              <ControlLabel>Simulation Speed</ControlLabel>
              <SpeedValue>{speedToMs(speed)}</SpeedValue>
            </SpeedTopRow>
            <Slider
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
            />
          </SpeedGroup>

          <ArraySizeGroup>
            <ControlLabel>Array Size</ControlLabel>
            <PresetButtons>
              {[25, 50, 100].map((size) => (
                <PresetBtn
                  key={size}
                  $active={arraySize === size}
                  onClick={() => onArraySizeChange(size)}
                  disabled={isRunning && !isPaused}
                >
                  {size}
                </PresetBtn>
              ))}
            </PresetButtons>
          </ArraySizeGroup>
        </ControlsStrip>

        <VisualizationPanel>
          <StatusBadges comparing={comparing} swapping={swapping} array={array} />
          <ArrayBars
            array={array}
            comparing={comparing}
            swapping={swapping}
            sorted={sorted}
            maxValue={maxValue}
          />
          <StatsRow>
            <Stat><strong>{comparisons}</strong> comparisons</Stat>
            <Stat><strong>{swaps}</strong> writes</Stat>
            <Timer>{formatTime(elapsedTime)}</Timer>
          </StatsRow>
        </VisualizationPanel>

        <LowerSection>
          <HowItWorks steps={algorithm.howItWorks} />
          <SideCards>
            <SpaceComplexityCard
              label={algorithm.spaceComplexityLabel}
              desc={algorithm.spaceComplexityDesc}
            />
            <ProTipCard
              title={algorithm.proTip.title}
              text={algorithm.proTip.text}
            />
          </SideCards>
        </LowerSection>

        <ReferenceImplementation implementations={algorithm.implementations} />
      </DetailWrapper>
    );
  }
);
