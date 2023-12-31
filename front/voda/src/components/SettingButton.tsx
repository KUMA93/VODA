import React, { useContext } from 'react';

import styled from 'styled-components';
import { ThemeContext } from '../App';
import { SimpleTheme, Theme } from '../styles/theme';


interface ThemeProps {
  theme: Theme;
}

const SettingButton = styled('button')<ThemeProps>`
  width: 11vw;
  height: 40px;
  border-radius: 10px;
  font-size: 1.3vw;
  padding: 8px;
  margin: 8px;
  border: 1px solid ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.body};

  &:hover {
    background: ${({ theme }) =>
      theme === SimpleTheme ? '#FFD60A' : '#003566'};
    transition: all 0.1s ease-in-out;
  }

  @media (max-width: 768px) {
    width: 80%; /* 또는 원하는 크기로 지정 */
  }
  
`;


export interface ButtonProps {
  text: string;
  onClick: (event: any) => void;
  'aria-label'?: string
  id? : string;
  className?: string;
  style?: string;
  tabIndex?: number;
}

export default function Setting({ text, onClick, "aria-label":ariaLabel, id, className, tabIndex }: ButtonProps ) {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <SettingButton tabIndex={tabIndex} theme={theme} onClick={onClick} aria-label={ariaLabel} id={id} className={className}>{text}</SettingButton>
    </>
  );
}