// styles/GlobalStyles.tsx
import React from 'react';
import { theme } from 'twin.macro';
import { createGlobalStyle } from 'styled-components';
import { GlobalStyles as BaseStyles } from 'twin.macro';
import { MumbleStyles } from '@smartive-education/design-system-component-library-yeahyeahyeah';

const CustomStyles = createGlobalStyle({
  body: {
    background: theme`colors.slate.100`,
  },
  a: {
    cursor: 'pointer',
    hyphens: 'auto',
  },
  p: {
    hyphens: 'auto',
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <MumbleStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
