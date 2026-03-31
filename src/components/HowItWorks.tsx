import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

interface HowItWorksProps {
  steps: string[];
}

const Section = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 20px;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const StepRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const StepNumber = styled.div`
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 50%;
  background: rgba(0, 180, 255, 0.12);
  border: 1px solid rgba(0, 180, 255, 0.3);
  color: ${colors.blue};
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepText = styled.p`
  font-size: 0.9rem;
  color: ${colors.textMuted};
  line-height: 1.5;
  padding-top: 3px;
`;

export const HowItWorks: React.FC<HowItWorksProps> = ({ steps }) => (
  <Section>
    <SectionTitle>How it works</SectionTitle>
    <StepList>
      {steps.map((step, i) => (
        <StepRow key={i}>
          <StepNumber>{i + 1}</StepNumber>
          <StepText>{step}</StepText>
        </StepRow>
      ))}
    </StepList>
  </Section>
);
