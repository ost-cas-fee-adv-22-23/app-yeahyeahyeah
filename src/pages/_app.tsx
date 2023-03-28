// pages/_app.tsx
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultLayout } from '../layouts';
import '../styles/alert.css';
import '../styles/keyword.css';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <GlobalStyles />
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  </SessionProvider>
);

export default App;
