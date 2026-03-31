import React from 'react';
import styled from 'styled-components';

interface ArrayBarsProps {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  maxValue: number;
}

const BarsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 280px;
  gap: 1px;
`;

const Bar = styled.div<{ $height: number; $color: string; $width: number }>`
  height: ${(p) => p.$height}%;
  background-color: ${(p) => p.$color};
  width: ${(p) => p.$width}%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: height 0.05s ease, background-color 0.1s ease;
  border-radius: 3px 3px 0 0;
  min-width: 2px;
`;

const BarValue = styled.span`
  font-size: 10px;
  color: #fff;
  padding-bottom: 5px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
`;

export const ArrayBars: React.FC<ArrayBarsProps> = ({
  array,
  comparing,
  swapping,
  sorted,
  maxValue,
}) => {
  const getBarColor = (index: number): string => {
    if (swapping.includes(index)) return '#ef4444';
    if (comparing.includes(index)) return '#eab308';
    if (sorted.includes(index)) return '#22c55e';
    return '#00b4ff';
  };

  return (
    <BarsContainer>
      {array.map((value, index) => (
        <Bar
          key={index}
          $height={(value / maxValue) * 100}
          $color={getBarColor(index)}
          $width={Math.max(2, 100 / array.length - 0.5)}
        >
          {array.length <= 20 && <BarValue>{value}</BarValue>}
        </Bar>
      ))}
    </BarsContainer>
  );
};
