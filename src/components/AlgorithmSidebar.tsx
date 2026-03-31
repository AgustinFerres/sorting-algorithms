import React from 'react';
import styled from 'styled-components';
import { SortAlgorithm } from '../algorithms/types';
import { colors, layout } from '../styles/theme';

interface AlgorithmSidebarProps {
  algorithms: SortAlgorithm[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const SidebarWrapper = styled.div`
  width: ${layout.sidebarWidth};
  min-width: ${layout.sidebarWidth};
  background: ${colors.surface};
  border-right: 1px solid ${colors.border};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SidebarHeading = styled.div`
  padding: 20px 20px 14px;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${colors.textDim};
  text-transform: uppercase;
  border-bottom: 1px solid ${colors.border};
`;

const HeadingLabel = styled.div`
  color: ${colors.textDim};
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  margin-bottom: 4px;
`;

const HeadingTitle = styled.div`
  color: ${colors.textMuted};
  font-size: 0.68rem;
  letter-spacing: 0.1em;
`;

const AlgoList = styled.div`
  padding: 8px 0;
`;

const AlgoItem = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: ${({ $selected }) => ($selected ? 'rgba(0, 180, 255, 0.1)' : 'none')};
  border: none;
  border-left: 2px solid ${({ $selected }) => ($selected ? colors.blue : 'transparent')};
  color: ${({ $selected }) => ($selected ? colors.blue : colors.textMuted)};
  font-size: 0.88rem;
  font-weight: ${({ $selected }) => ($selected ? '600' : '400')};
  cursor: pointer;
  text-align: left;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(0, 180, 255, 0.12)' : colors.surfaceHover)};
    color: ${({ $selected }) => ($selected ? colors.blue : colors.text)};
  }
`;

const AlgoIcon = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? 'rgba(0, 180, 255, 0.2)' : 'rgba(255,255,255,0.05)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

// Simple icon glyphs per algorithm category
const ICONS: Record<string, string> = {
  'Bubble Sort': '⟳',
  'Selection Sort': '↓',
  'Insertion Sort': '↙',
  'Merge Sort': '⊕',
  'Quick Sort': '⚡',
  'Heap Sort': '△',
  'Counting Sort': '#',
  'Radix Sort': '0-9',
  'Bucket Sort': '▤',
};

export const AlgorithmSidebar: React.FC<AlgorithmSidebarProps> = ({
  algorithms,
  selectedIndex,
  onSelect,
}) => (
  <SidebarWrapper>
    <SidebarHeading>
      <HeadingLabel>Library</HeadingLabel>
      <HeadingTitle>Select Algorithm</HeadingTitle>
    </SidebarHeading>
    <AlgoList>
      {algorithms.map((algo, i) => (
        <AlgoItem key={algo.name} $selected={i === selectedIndex} onClick={() => onSelect(i)}>
          <AlgoIcon $selected={i === selectedIndex}>
            {ICONS[algo.name] ?? '▷'}
          </AlgoIcon>
          {algo.name}
        </AlgoItem>
      ))}
    </AlgoList>
  </SidebarWrapper>
);
