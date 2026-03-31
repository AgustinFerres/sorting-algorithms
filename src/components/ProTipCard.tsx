import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

interface ProTipCardProps {
  title: string;
  text: string;
}

const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-left: 3px solid ${colors.blue};
  border-radius: 8px;
  padding: 18px;
`;

const CardHeader = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${colors.blue};
  margin-bottom: 8px;
`;

const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 10px;
`;

const CardText = styled.p`
  font-size: 0.82rem;
  color: ${colors.textMuted};
  line-height: 1.55;
`;

export const ProTipCard: React.FC<ProTipCardProps> = ({ title, text }) => (
  <Card>
    <CardHeader>Pro Tip</CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardText>{text}</CardText>
  </Card>
);
