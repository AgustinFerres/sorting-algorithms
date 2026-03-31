import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

interface StatusBadgesProps {
  comparing: number[];
  swapping: number[];
  array: number[];
}

const BadgesWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Badge = styled.div`
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid ${colors.border};
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  color: ${colors.textMuted};
  white-space: nowrap;
`;

const Dot = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  margin-right: 5px;
`;

export const StatusBadges: React.FC<StatusBadgesProps> = ({ comparing, swapping, array }) => {
  const active = swapping.length > 0 ? 'swapping' : comparing.length > 0 ? 'comparing' : null;
  if (!active) return null;

  const indices = active === 'swapping' ? swapping : comparing;
  const label = active === 'swapping' ? 'SWAPPING' : 'COMPARING';
  const dotColor = active === 'swapping' ? colors.red : colors.blue;

  const elements = indices
    .slice(0, 2)
    .map((i) => array[i])
    .filter((v) => v !== undefined);

  return (
    <BadgesWrapper>
      <Badge>
        <Dot $color={dotColor}>●</Dot>
        {label}
      </Badge>
      {elements.length > 0 && (
        <Badge>ELEMENTS: {elements.join(' & ')}</Badge>
      )}
    </BadgesWrapper>
  );
};
