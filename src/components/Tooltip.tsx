import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/theme';

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Bubble = styled.div`
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a4a;
  color: ${colors.text};
  border: 1px solid #444;
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: normal;
  width: 220px;
  z-index: 100;
  pointer-events: none;
  transition: opacity 0.15s ease;

  /* arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #444;
  }

  ${Wrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid ${colors.textDim};
  color: ${colors.textDim};
  font-size: 0.65rem;
  font-style: normal;
  cursor: default;
  user-select: none;
  margin-left: 5px;
  flex-shrink: 0;
`;

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => (
  <Wrapper>
    <Icon>i</Icon>
    <Bubble>{text}</Bubble>
  </Wrapper>
);
