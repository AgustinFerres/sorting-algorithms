import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

interface SpaceComplexityCardProps {
  label: string;
  desc: string;
}

const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 18px;
`;

const CardHeader = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.textDim};
  margin-bottom: 8px;
`;

const CardLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${colors.blue};
  margin-bottom: 10px;
`;

const CardDesc = styled.p`
  font-size: 0.82rem;
  color: ${colors.textMuted};
  line-height: 1.55;
`;

export const SpaceComplexityCard: React.FC<SpaceComplexityCardProps> = ({ label, desc }) => (
  <Card>
    <CardHeader>Space Complexity</CardHeader>
    <CardLabel>{label}</CardLabel>
    <CardDesc>{desc}</CardDesc>
  </Card>
);
