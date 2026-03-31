import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../styles/theme';

interface ReferenceImplementationProps {
  implementations: { js: string };
}

const Wrapper = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  margin-top: 32px;
`;

const Header = styled.button`
  width: 100%;
  background: ${colors.surface};
  border: none;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: ${colors.textMuted};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: left;

  &:hover {
    background: ${colors.surfaceHover};
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
  font-size: 0.8rem;
`;

const Body = styled.div`
  border-top: 1px solid ${colors.border};
`;

const TabRow = styled.div`
  display: flex;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? colors.blue : 'transparent')};
  color: ${({ $active }) => ($active ? colors.blue : colors.textDim)};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${colors.textMuted};
  }
`;

const CodeBlock = styled.pre`
  background: #080808;
  padding: 20px 24px;
  overflow-x: auto;
  margin: 0;
  font-family: ${fonts.mono};
  font-size: 0.82rem;
  line-height: 1.6;
  color: #cdd3de;
`;

export const ReferenceImplementation: React.FC<ReferenceImplementationProps> = ({ implementations }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <Header onClick={() => setIsOpen((o) => !o)}>
        <span>Reference Implementation</span>
        <Chevron $open={isOpen}>▾</Chevron>
      </Header>
      {isOpen && (
        <Body>
          <TabRow>
            <Tab $active>JS</Tab>
          </TabRow>
          <CodeBlock>{implementations.js}</CodeBlock>
        </Body>
      )}
    </Wrapper>
  );
};
