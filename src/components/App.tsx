import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Visualizer } from './Visualizer';
import { colors, fonts, layout } from '../styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    height: 100%;
  }
  body {
    font-family: ${fonts.sans};
    background-color: ${colors.bg};
    color: ${colors.text};
    overflow: hidden;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${colors.bg};
  }
  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
  }
`;

const AppShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const TopNav = styled.nav`
  height: ${layout.navHeight};
  background: ${colors.bg};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const NavBrand = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${colors.text};
  margin-right: auto;

  span {
    color: ${colors.blue};
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: 32px;
`;

const NavItem = styled.a<{ $active?: boolean }>`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? colors.text : colors.textDim)};
  text-decoration: none;
  cursor: pointer;
  padding-bottom: 2px;
  border-bottom: ${({ $active }) => ($active ? `2px solid ${colors.blue}` : '2px solid transparent')};
  transition: color 0.15s;

  &:hover {
    color: ${colors.textMuted};
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  margin-top: ${layout.navHeight};
  overflow: hidden;
  height: calc(100vh - ${layout.navHeight});
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <AppShell>
        <TopNav>
          <NavBrand>
            Algorithmic <span>Atelier</span>
          </NavBrand>
          <NavItems>
            {(['VISUALIZER', 'TUTORIALS', 'THEORY', 'SANDBOX'] as const).map((item) => (
              <NavItem key={item} $active={item === 'VISUALIZER'}>{item}</NavItem>
            ))}
          </NavItems>
        </TopNav>
        <Body>
          <Visualizer />
        </Body>
      </AppShell>
    </>
  );
};

export default App;
